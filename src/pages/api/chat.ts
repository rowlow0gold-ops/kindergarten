import type { APIRoute } from "astro";

// Proxies chat requests to a self-hosted AI model reachable over a Cloudflare
// tunnel. Secrets stay server-side and are NEVER sent to the browser.
//
// Env vars (set in .env for dev, or Cloudflare Worker secrets in prod):
//   AI_API_URL   Full chat-completions URL (OpenAI-compatible / Ollama)
//   AI_MODEL     Model name (default: "default")
//   AI_API_KEY   Optional bearer token
//   CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET  Optional Access service token
//   AI_SYSTEM_PROMPT  Optional system prompt override

export const prerender = false;

function env(key: string): string | undefined {
  const meta = (import.meta as { env?: Record<string, string | undefined> }).env;
  return meta?.[key] ?? (typeof process !== "undefined" ? process.env?.[key] : undefined);
}

const DEFAULT_SYSTEM =
  "You are the friendly AI assistant for Hanbit International Kindergarten, an English-immersion kindergarten with campuses in Seoul, Busan, Daejeon, Daegu, and Gwangju. Answer briefly and warmly. If you don't know something specific, suggest contacting the school at 02-1234-5678. Reply in the same language the user writes in.";

export const POST: APIRoute = async ({ request }) => {
  const apiUrl = env("AI_API_URL");
  if (!apiUrl) {
    return json({ unconfigured: true }, 200);
  }

  let messages: { role: string; content: string }[] = [];
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const trimmed = messages
    .filter((mm) => mm && typeof mm.content === "string" && (mm.role === "user" || mm.role === "assistant"))
    .slice(-12);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const apiKey = env("AI_API_KEY");
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  const cfId = env("CF_ACCESS_CLIENT_ID");
  const cfSecret = env("CF_ACCESS_CLIENT_SECRET");
  if (cfId && cfSecret) {
    headers["CF-Access-Client-Id"] = cfId;
    headers["CF-Access-Client-Secret"] = cfSecret;
  }

  const payload = {
    model: env("AI_MODEL") || "default",
    messages: [{ role: "system", content: env("AI_SYSTEM_PROMPT") || DEFAULT_SYSTEM }, ...trimmed],
    stream: false,
    temperature: 0.6,
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    const upstream = await fetch(apiUrl, { method: "POST", headers, body: JSON.stringify(payload), signal: ctrl.signal });
    clearTimeout(timer);
    if (!upstream.ok) return json({ error: `Upstream ${upstream.status}` }, 502);
    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content ?? data?.message?.content ?? data?.response ?? "";
    if (!reply) return json({ error: "Empty reply from model" }, 502);
    return json({ reply: String(reply).trim() }, 200);
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return json({ error: aborted ? "Model timed out" : "Could not reach the model" }, 502);
  }
};

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
