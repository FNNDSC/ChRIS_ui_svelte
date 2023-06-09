import Client from "@fnndsc/chrisapi";
import { PUBLIC_API_URL } from "$env/static/public";

export const fetchClient = (token: string) => {
  const client = new Client(PUBLIC_API_URL, {
    token,
  });
  return client;
};
