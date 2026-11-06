import { randomUUID } from "crypto";
import { cookies } from "next/headers";

const sessions = globalThis.__addisEatsSessions ?? new Map();

if (!globalThis.__addisEatsSessions) {
  globalThis.__addisEatsSessions = sessions;
}

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function createSession(user) {
  const sessionId = randomUUID();

  sessions.set(sessionId, user);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  return sessions.get(sessionId) ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE);
}