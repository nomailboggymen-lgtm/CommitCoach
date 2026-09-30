const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MentorRequest {
  project: {
    name: string;
    type: string;
    experience: string;
    learningGoals: string[];
  };
  mission: {
    title: string;
    concept: string;
    challenge: string;
    whatYouLearn: string;
  };
  mode: "explain" | "hint" | "stuck";
  hintLevel?: number;
  stuckType?: string | null;
  userMessage?: string;
}

const SYSTEM_PROMPT = `You are CommitCoach, a beginner programming mentor.
- Teach rather than replace the learner.
- Prefer questions and hints before solutions.
- Use plain, beginner-friendly language.
- Keep answers concise — under 200 words.
- Adapt explanations to the user's experience level.
- Never claim to have inspected code unless code was provided.
- Never fabricate errors, files, outputs, or test results.
- When debugging, separate observations from guesses.
- Encourage the learner to try a concrete next step.`;

function buildUserPrompt(req: MentorRequest): string {
  const exp = req.project.experience || "beginner";
  const goals = req.project.learningGoals?.length
    ? req.project.learningGoals.join(", ")
    : "general programming";

  const base = `Project: ${req.project.name} (${req.project.type})
Experience: ${exp}
Learning goals: ${goals}

Mission: ${req.mission.title}
Concept: ${req.mission.concept}
What they'll learn: ${req.mission.whatYouLearn}
Challenge: ${req.mission.challenge}`;

  if (req.mode === "explain") {
    return `${base}

Explain the concept "${req.mission.concept}" to a ${exp} using simple language and a small analogy. Do NOT provide a full implementation. Keep it under 150 words.`;
  }

  if (req.mode === "hint") {
    const level = req.hintLevel ?? 1;
    if (level === 1) {
      return `${base}

Give a conceptual hint. Structure your response as:
**Think about this**
(one paragraph)
**Try this next**
(one short paragraph)
**Check yourself**
(one question the learner can ask themselves)
Do NOT provide a full solution. Keep it under 150 words.`;
    }
    if (level === 2) {
      return `${base}

Give a more specific hint. Point toward the specific part of the code or approach the learner should focus on. Use the same structure:
**Think about this**
**Try this next**
**Check yourself**
Do NOT provide a full solution. Keep it under 150 words.`;
    }
    return `${base}

Show a very small code snippet (3-5 lines max) that illustrates the concept, but NOT a complete implementation of the challenge. Use the same structure:
**Think about this**
**Try this next**
**Check yourself**
Keep it under 180 words.`;
  }

  // stuck
  const stuck = req.stuckType ? `Problem: ${req.stuckType}` : "Problem: not specified";
  const msg = req.userMessage?.trim() ? `User description: ${req.userMessage}` : "User description: none provided";
  return `${base}

${stuck}
${msg}

Respond with:
1. The likely area to inspect (without claiming certainty)
2. One or two debugging questions
3. One next action to try
4. Why that action is useful

Do NOT claim certainty about the cause unless the user provided enough information. Keep it under 200 words.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json() as MentorRequest;

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          fallback: true,
          response: "",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPrompt = buildUserPrompt(body);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!openaiResponse.ok) {
      return new Response(
        JSON.stringify({ fallback: true, response: "" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await openaiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return new Response(
        JSON.stringify({ fallback: true, response: "" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ fallback: false, response: content }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({ fallback: true, response: "" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
