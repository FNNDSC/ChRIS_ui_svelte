import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
  if (!locals.user) {
    throw redirect(404, "/login");
  }
  const userName = locals.user.name;
  throw redirect(304, `uploads/${userName}/uploads`);
}
