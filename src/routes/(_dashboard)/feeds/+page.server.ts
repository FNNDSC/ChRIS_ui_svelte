import type { PageServerLoad } from "./$types";
import { redirect, error, fail } from "@sveltejs/kit";
import { fetchClient } from "$lib/client";

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  const session = cookies.get("session");
  if (!session) {
    throw error(404, {
      message: "Could not fetch the token. Please login again",
    });
  }

  const client = fetchClient(session);

  const limit = 15;
  const currentPage = Math.max(Number(url.searchParams.get("page") || 1), 1);
  const search = url.searchParams.get("search") || "";
  const filter = url.searchParams.get("filter") || "";

  try {
    const feedsList = await client.getFeeds({
      limit,
      offset: (currentPage - 1) * limit,
      [filter]: search,
    });

    const feeds = feedsList.data;

    return {
      feeds: feeds ? feeds : [],
      totalCount: feedsList.totalCount,
    };
  } catch (reason: any) {
    throw error(404, {
      message: reason.message,
    });
  }
};
