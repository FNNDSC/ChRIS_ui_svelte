import { redirect, createCookieSessionStorage } from "@remix-run/node";
import Client from "@fnndsc/chrisapi";

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

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getToken(request: Request) {
  const session = await getSession(request);
  const token = session.get(USER_SESSION_KEY);
  return token;
}

const getUserById = async (token: string) => {
  const client = fetchClient(token);
  const user = (await client.getUser()).data;

  return user;
};

export const getUser = async (request: Request) => {
  const token = await getToken(request);
  if (token === undefined) return null;

  const user = getUserById(token);

  if (user) return user;

  throw await logout(request);
};

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

export async function login(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const token = await getToken(request);
  if (!token) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return token;
}

const fetchClient = (token: string) => {
  const client = new Client("http://localhost:8000/api/v1/", {
    token,
  });
  return client;
};

export async function requireUser(request: Request) {
  const token = await requireUserId(request);
  const user = await getUserById(token);
  if (user) return user;

  throw await logout(request);
}
