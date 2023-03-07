import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(20, "1 d"),
  ephemeralCache: new Map(),
  analytics: true,
});

export default async function middleware(request, event) {
  const ip = request.ip ?? "127.0.0.1";
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(`pri_ai_ratelimit_${ip}`);
  event.waitUntil(pending);
  const res = success ? NextResponse.next() : NextResponse.redirect(new URL("/api/error", request.url));
  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", reset.toString());
  return res;

};

export const config = {
  matcher: "/api/chat",
};
