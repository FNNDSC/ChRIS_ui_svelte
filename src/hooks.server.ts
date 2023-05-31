import type { Handle } from "@sveltejs/kit";
import { fetchClient } from "$lib/utils/client";

export const handle: Handle = async ({ event, resolve }) => {
  // get cookies from browser
  const session = event.cookies.get("session");

  if (!session) {
    // if there is no session load page as normal
    return await resolve(event);
  }

  const client = await fetchClient(session);
  const user = await (await client.getUser()).data;

  // if `user` exists set `events.local`
  if (user) {
    event.locals.user = {
      name: user.username,
    };
  }

  // load page as normal
  return await resolve(event);
};
