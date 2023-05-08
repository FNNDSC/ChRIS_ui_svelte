import { json } from "@remix-run/node";
import Client from "@fnndsc/chrisapi";

/**
 * This helper function helps us to return the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });

export async function verifyLogin(username: string, password: string) {
  const authURL = "http://localhost:8000/api/v1/auth-token/";
  const token = await Client.getAuthToken(authURL, username, password);

  if (!token) return null;
  return token;
}
