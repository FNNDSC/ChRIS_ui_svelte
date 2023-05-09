import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getFeeds } from "~/api/feeds";
import Pagination from "~/components/Pagination";
import { getToken, requireUserId } from "~/utils/session.server";

const PER_PAGE = 12;

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const url = new URL(request.url);
  const query = url.searchParams;
  const currentPage = Math.max(Number(query.get("page") || 1), 1);

  const token = await getToken(request);
  const { feeds, paginate } = await getFeeds({
    name: "",
    limit: PER_PAGE,
    offset: (currentPage - 1) * PER_PAGE,
    token,
  });

  return {
    feeds,
    paginate: {
      ...paginate,
      perPage: PER_PAGE,
      currentPage,
    },
  };
};

export default function Example() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="bg-gray-900">
        <div className="max-w-9xl">
          <div className="bg-gray-900 py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-white">
                    Existing Analyses ({data.paginate.totalCount})
                  </h1>
                  <p className="mt-2 text-sm text-gray-300">
                    A list of all the analyses in your account including their
                    statuses and runtime.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    type="button"
                    className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Add Analysis
                  </button>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            Name
                          </th>

                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            ID
                          </th>

                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            Created
                          </th>

                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            Creator
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            Run Time
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            Size
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {data.feeds.map((item) => (
                          <tr key={item.id}>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white sm:pl-0">
                              {item.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white sm:pl-0">
                              {item.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm  text-white sm:pl-0">
                              {item.creation_date}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white sm:pl-0">
                              {item.creator_username}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white sm:pl-0">
                              N/A
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white sm:pl-0">
                              N/A
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white sm:pl-0">
                              N/A
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <a
                                href="/edit"
                                className="text-indigo-400 hover:text-indigo-300"
                              >
                                Edit
                                <span className="sr-only">, {item.name}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Pagination paginate={data.paginate} />
    </>
  );
}
