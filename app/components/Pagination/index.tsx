import { useSearchParams, Link } from "@remix-run/react";
import type { Paginate } from "~/api/feeds";

export type LoaderParams = {
  perPage: number;
  currentPage: number;
};

export default function Pagination({
  paginate,
}: {
  paginate: Paginate & LoaderParams;
}) {
  const pageParam = "page";
  const [queryParams] = useSearchParams();
  const currentPage = Number(queryParams.get(pageParam) || 1);
  const endCount = currentPage * paginate.perPage;
  const previousQuery = new URLSearchParams(queryParams);
  previousQuery.set(pageParam, `${currentPage - 1}`);
  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, `${currentPage + 1}`);

  const totalPages = Math.ceil(paginate.totalCount / paginate.perPage);

  return (
    <nav
      className="bg-gray-900 flex items-center justify-between border-t border-gray-700  px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium">{currentPage}</span> to{" "}
          <span className="font-medium">{endCount}</span> of{" "}
          <span className="font-medium">{totalPages}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        {paginate.previous && (
          <Link
            to={`?${previousQuery.toString()}`}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Previous
          </Link>
        )}

        {paginate.next && (
          <Link
            to={`?${nextQuery.toString()}`}
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
