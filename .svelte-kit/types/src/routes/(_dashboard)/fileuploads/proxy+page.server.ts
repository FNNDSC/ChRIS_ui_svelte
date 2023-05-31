// @ts-nocheck
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load = async ({ locals, cookies }: Parameters<PageServerLoad>[0]) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  return {
    token: cookies.get("session"),
  };
};
