import { redirect, createCookieSessionStorage } from "@remix-run/node";

const USER_SESSION_KEY = "userId";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: "Test",
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
  request,
  token,
}: {
  request: Request;
  token: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, token);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

export async function getToken(request: Request) {
  const session = await getSession(request);
  const token = session.get(USER_SESSION_KEY);
  return token;
}
