const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisRequest {
  owner: string;
  repo: string;
}

const FEATURE_WORDS = [
  "add", "feat", "fix", "improve", "update", "refactor", "polish",
  "create", "implement", "build", "setup", "configure", "style",
  "wip", "init", "deploy", "connect", "persist", "handle",
];

function validateOwnerRepo(owner: string, repo: string): boolean {
  if (!owner || !repo) return false;
  if (owner.length > 100 || repo.length > 100) return false;
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(owner)) return false;
  if (!/^[a-zA-Z0-9._-]+$/.test(repo)) return false;
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { owner, repo } = await req.json() as AnalysisRequest;

    if (!validateOwnerRepo(owner, repo)) {
      return new Response(
        JSON.stringify({ error: "invalid-url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiBase = "https://api.github.com";

    // 1. Repository metadata
    const repoRes = await fetch(`${apiBase}/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "CommitCoach",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (repoRes.status === 404) {
      return new Response(
        JSON.stringify({ error: "not-found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (repoRes.status === 403) {
      const remaining = repoRes.headers.get("x-ratelimit-remaining");
      if (remaining === "0") {
        return new Response(
          JSON.stringify({ error: "rate-limit" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "private" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!repoRes.ok) {
      return new Response(
        JSON.stringify({ error: "network" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch ?? "main";

    // 2. Recent commits (30 per page)
    const commitsRes = await fetch(
      `${apiBase}/repos/${owner}/${repo}/commits?per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "CommitCoach",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!commitsRes.ok) {
      return new Response(
        JSON.stringify({ error: "network" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const commitsData = await commitsRes.json();

    // 3. README check
    let hasReadme = false;
    try {
      const readmeRes = await fetch(
        `${apiBase}/repos/${owner}/${repo}/readme`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "CommitCoach",
          },
          signal: AbortSignal.timeout(8000),
        },
      );
      hasReadme = readmeRes.ok;
    } catch {
      hasReadme = false;
    }

    // Build commit list
    const commits = (commitsData as unknown[]).map((c: any) => {
      const message = c.commit?.message ?? "";
      const firstLine = message.split("\n")[0] ?? "";
      return {
        sha: c.sha ?? "",
        message: firstLine,
        author: c.commit?.author?.name ?? c.commit?.committer?.name ?? "Unknown",
        date: c.commit?.author?.date ?? c.commit?.committer?.date ?? "",
        url: c.html_url ?? `https://github.com/${owner}/${repo}/commit/${c.sha}`,
      };
    });

    // 4. Fetch file counts for each commit (lightweight — only if commits exist, cap at 30)
    let totalFilesChanged = 0;
    let filesReliable = true;

    if (commits.length > 0 && commits.length <= 30) {
      for (const commit of commits) {
        try {
          const detailRes = await fetch(
            `${apiBase}/repos/${owner}/${repo}/commits/${commit.sha}`,
            {
              headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "CommitCoach",
              },
              signal: AbortSignal.timeout(8000),
            },
          );
          if (detailRes.ok) {
            const detail = await detailRes.json();
            const count = Array.isArray(detail.files) ? detail.files.length : 0;
            commit.filesChanged = count;
            totalFilesChanged += count;
          } else {
            filesReliable = false;
          }
        } catch {
          filesReliable = false;
        }
      }
    } else {
      filesReliable = false;
    }

    // Calculate statistics
    const analyzedCommitCount = commits.length;
    const dates = new Set<string>();
    for (const c of commits) {
      if (c.date) {
        dates.add(c.date.split("T")[0]);
      }
    }
    const activeDays = dates.size;

    const sortedByDate = [...commits].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const firstCommit = sortedByDate[0];
    const latestCommit = sortedByDate[sortedByDate.length - 1];

    // 5. Iteration signals
    const signals: string[] = [];

    if (analyzedCommitCount > 1) {
      signals.push("Your project shows multiple iterations");
    }

    if (activeDays > 1) {
      signals.push("Your project evolved across multiple days");
    }

    if (hasReadme) {
      signals.push("You documented your project");
    }

    const hasFeatureWords = commits.some((c) => {
      const lower = c.message.toLowerCase();
      return FEATURE_WORDS.some((w) => lower.includes(w));
    });
    if (hasFeatureWords) {
      signals.push("Your history contains feature and improvement iterations");
    }

    const analysis = {
      owner,
      repo,
      name: repoData.name ?? repo,
      description: repoData.description ?? undefined,
      language: repoData.language ?? undefined,
      defaultBranch,
      commits,
      analyzedCommitCount,
      activeDays,
      firstCommit,
      latestCommit,
      hasReadme,
      signals,
      totalFilesChanged: filesReliable ? totalFilesChanged : undefined,
      analyzedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(analysis),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "network" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
