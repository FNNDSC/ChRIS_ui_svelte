import { fetchClient } from "~/utils/session.server";

type FeedParam = {
  name: string;
  limit: number;
  offset: number;
  token: string;
};

export type Paginate = {
  next: boolean;
  previous: boolean;
  totalCount: number;
};

export const getFeeds = async ({ name, limit, offset, token }: FeedParam) => {
  const client = fetchClient(token);
  const feeds = await client.getFeeds({ name, limit, offset });

  return {
    feeds: feeds.data,
    paginate: {
      next: feeds.hasNextPage,
      previous: feeds.hasPreviousPage,
      totalCount: feeds.totalCount,
      offset: offset,
    },
  };
};
