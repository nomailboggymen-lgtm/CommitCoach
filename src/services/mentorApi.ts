import type { MentorRequest, MentorResponse } from '@/types/mentor';

const MENTOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mentor`;

export async function callMentor(req: MentorRequest): Promise<MentorResponse> {
  try {
    const res = await fetch(MENTOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) return { fallback: true, response: '' };

    const data = await res.json();
    if (!data || typeof data.response !== 'string') {
      return { fallback: true, response: '' };
    }
    return { fallback: !!data.fallback, response: data.response };
  } catch {
    return { fallback: true, response: '' };
  }
}
