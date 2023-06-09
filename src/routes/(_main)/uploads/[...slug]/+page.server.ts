import { redirect, error } from "@sveltejs/kit";
import { fetchClient } from "$lib/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals,
  cookies,
  params,
  depends,
}) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  const session = cookies.get("session");
  if (!session) {
    throw error(404, {
      message: "Are you logged in?",
    });
  }

  const isUploads = params.slug.split("/")[1];

  if (isUploads !== "uploads") {
    throw error(404, {
      message: "Are you trying to browse the uploads space?",
    });
  }

  const client = fetchClient(session);

  depends("app:reload");
  
  const uploads = await client.getFileBrowserPaths({
    path: params.slug,
  });
  const pathList = await client.getFileBrowserPath(params.slug);

  const fileList = await pathList.getFiles({
    limit: 1000,
    offset: 0,
  });

  const parsedUpload =
    uploads.data && uploads.data[0].subfolders
      ? JSON.parse(uploads.data[0].subfolders)
      : [];

  const folders = parsedUpload.map((folder: string) => {
    return {
      name: folder,
      path: params.slug,
    };
  });

  const files = fileList.data ? fileList.data : [];

  return {
    folders,
    files,
    token: session,
  };
};
