import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_SECONDS = 300; // 5 minutes between submissions
const COOKIE_NAME = "cs_last_sub";
const ACCESS_KEY = "fbaa5f38-e4b7-4daa-86cc-a7fb5f040dfa";

export async function POST(req: NextRequest) {
  const now = Date.now();
  const lastSub = req.cookies.get(COOKIE_NAME)?.value;

  if (lastSub) {
    const elapsed = (now - parseInt(lastSub, 10)) / 1000;
    if (elapsed < RATE_LIMIT_SECONDS) {
      return NextResponse.json({ success: false, message: "rate_limited" }, { status: 429 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "invalid_body" }, { status: 400 });
  }

  // Honeypot check
  if (body.botcheck) {
    return NextResponse.json({ success: false, message: "bot_detected" }, { status: 400 });
  }

  try {
    const upstream = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: ACCESS_KEY, ...body }),
    });
    const json = await upstream.json();

    if (!json.success) {
      return NextResponse.json({ success: false }, { status: 502 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, String(now), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: RATE_LIMIT_SECONDS,
    });
    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
