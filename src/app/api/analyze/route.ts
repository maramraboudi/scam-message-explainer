import { analyzeMessage } from "@/lib/analysis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  content: z.string().trim().min(8, "Enter at least 8 characters.").max(12000, "Content is too long."),
  source: z.enum(["Email", "SMS", "WhatsApp", "Social", "URL", "Other"])
});
const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const requestHost = request.headers.get("host") ?? request.nextUrl.host;
  if (origin && requestHost) {
    try {
      if (new URL(origin).host !== requestHost) {
        return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.reset > now && record.count >= 20) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again shortly." }, { status: 429 });
  }
  attempts.set(ip, record && record.reset > now ? { ...record, count: record.count + 1 } : { count: 1, reset: now + 60_000 });
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
    }
    return NextResponse.json(analyzeMessage(parsed.data.content), {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }
    });
  } catch {
    return NextResponse.json({ error: "The request could not be processed." }, { status: 400 });
  }
}
