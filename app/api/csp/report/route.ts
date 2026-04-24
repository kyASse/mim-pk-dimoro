import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    // In production, integrate with your logging platform instead of console
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[CSP-REPORT]', JSON.stringify(body));
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
  }
}
