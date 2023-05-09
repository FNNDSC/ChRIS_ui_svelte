import { fetchClient } from "~/utils/session.server";

export const getFeeds = async (
  name: string,
  limit: number,
  offset: number,
  token: string
) => {
  const client = fetchClient(token);
  const feeds = await client.getFeeds({ name, limit, offset });

  return {
    feeds: feeds.data,
  };
};
