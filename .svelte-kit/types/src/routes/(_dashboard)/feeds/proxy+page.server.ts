// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { redirect, error } from "@sveltejs/kit";
import { fetchClient } from "$lib/client";

export const load = async ({ locals, cookies, url }: Parameters<PageServerLoad>[0]) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  const limit = 15;
  const currentPage = Math.max(Number(url.searchParams.get("page") || 1), 1);
  const search = url.searchParams.get("search") || "";
  const filter = url.searchParams.get("filter") || "";

  if (limit > 15) {
    throw error(404, {
      message: "Bad Request",
    });
  }

  const session = cookies.get("session");
  if (!session) {
    throw error(404, {
      message: "Are you logged in?",
    });
  }
  const client = fetchClient(session);

  try {
    const feedsList = await client.getFeeds({
      limit,
      offset: (currentPage - 1) * limit,
      [filter]: search,
    });

    const feeds = await feedsList.data;

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
