<script lang="ts">
  import { page } from "$app/stores";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: pathname = $page.url.pathname;

  $: console.log(pathname);
</script>

<div class="grid grid-cols-6 gap-4 sm:grid-cols-3">
  {#each data.folders as folder (folder.name)}
    <div
      class="relative flex items-center space-x-3 rounded-lg border border-gray-300 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-200"
    >
      <div class="min-w-0 flex-1">
        <a href={`${pathname}/${folder.name}`} class="focus:outline-none">
          <span class="absolute inset-0" aria-hidden="true" />
          <p class="text-sm truncate font-medium text-white">{folder.name}</p>
        </a>
      </div>
    </div>
  {/each}
</div>

<ul
  class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
>
  {#each data.files as file (file.fname)}
    <li class="relative">
      <div
        class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
      >
        <img
          src="https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80"
          alt=""
          class="pointer-events-none object-cover group-hover:opacity-75"
        />
        <button type="button" class="absolute inset-0 focus:outline-none">
          <span class="text-white sr-only">{file.fname}</span>
        </button>
      </div>
      <p
        class="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-400"
      >
        {file.fname}
      </p>
      <p class="pointer-events-none block text-sm font-medium text-gray-500">
        {file.fsize}
      </p>
    </li>
  {/each}

  <!-- More files... -->
</ul>
