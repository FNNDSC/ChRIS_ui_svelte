<script lang="ts">
  import { page } from "$app/stores";

  export let data;
  let pageSize = 15;
  $: totalItems = data.totalCount;

  let options = [
    {
      id: 1,
      name: "Name",
      value: "name",
    },
    {
      id: 2,
      name: "Author",
      value: "author",
    },
  ];

  const pageParam = "page";
  $: currentPage = Number($page.url.searchParams.get(pageParam)) || 1;
  $: firstCount = currentPage === 1 ? 1 : (currentPage - 1) * pageSize;
  $: endCount = currentPage * pageSize;
  $: previousQuery = new URLSearchParams($page.url.searchParams);
  $: previousQuery.set(pageParam, `${currentPage - 1}`);
  $: nextQuery = new URLSearchParams($page.url.searchParams);
  $: nextQuery.set(pageParam, `${currentPage + 1}`);
  $: search = $page.url.searchParams.get("search") || "";
  $: filter = $page.url.searchParams.get("filter");

  let selected = filter || options[0].value;
</script>

<div>
  <div class="mx-auto">
    <div class="py-10">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-white">
              Existing Analyses ({totalItems})
            </h1>
            <p class="mt-2 text-sm text-gray-300">
              A list of all the analyses in your account including their name,
              id, status and size
            </p>
            <div class="inline-block">
              <div class="relative mt-2 rounded-md shadow-sm">
                <form method="GET">
                  <input
                    type="text"
                    name="search"
                    value={search}
                    id="search"
                    class="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />

                  <div class="absolute inset-y-0 right-0 flex items-center">
                    <label for="currency" class="sr-only">Currency</label>
                    <select
                      bind:value={selected}
                      id="filter"
                      name="filter"
                      class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      {#each options as option (option.id)}
                        <option value={option.value}>{option.name}</option>
                      {/each}
                    </select>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
            >
              <table class="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                      >Name</th
                    >
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >ID</th
                    >
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >Owner</th
                    >
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >Creation Date</th
                    >
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >Creation Date</th
                    >
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                  {#each data.feeds as feed (feed.id)}
                    <tr>
                      <td
                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0"
                        >{feed.name}</td
                      >
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                        >{feed.id}</td
                      >
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                        >{feed.creator_username}</td
                      >

                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                        >{feed.creation_date}</td
                      >

                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                        >Completed</td
                      >
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav
    class="flex items-center justify-between border-t border-gray-200 py-2 px-4 sm:px-6 lg:px-8"
    aria-label="Pagination"
  >
    <div class="hidden sm:block">
      <p class="text-sm text-gray-200">
        Showing
        <span class="font-medium">{firstCount}</span>
        to
        <span class="font-medium">{endCount}</span>
        of
        <span class="font-medium">{totalItems}</span>
        results
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end">
      {#if currentPage !== 0}
        <a
          href={`?${previousQuery.toString()}`}
          class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >Previous</a
        >
      {/if}

      <a
        href={`?${nextQuery.toString()}`}
        class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >Next</a
      >
    </div>
  </nav>
</div>
