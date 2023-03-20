import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimitChat = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(30, "3 h"),
  ephemeralCache: new Map(),
  analytics: true,
});

const ratelimitSave = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(30, "3 h"),
  ephemeralCache: new Map(),
  analytics: true,
});

export default async function middleware(request, event) {
  const ip = request.ip ?? "127.0.0.1";
  if (request.nextUrl.pathname.startsWith('/api/chat')) {
    const { success, pending, limit, reset, remaining } = await ratelimitChat.limit(`pri_ai_ratelimit_chat_${ip}`);
    event.waitUntil(pending);
    const res = success ? NextResponse.next() : NextResponse.redirect(new URL("/api/error", request.url));
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    return res;
  }
  if (request.nextUrl.pathname.startsWith('/api/save')) {
    const { success, pending, limit, reset, remaining } = await ratelimitSave.limit(`pri_ai_ratelimit_save_${ip}`);
    event.waitUntil(pending);
    const res = success ? NextResponse.next() : NextResponse.redirect(new URL("/api/error", request.url));
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    return res;
  }
  

};

export const config = {
  matcher: ["/api/chat","/api/save"],
};
