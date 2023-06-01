<script lang="ts">
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  import { Card } from "$components/ui/card";
  import { Folder } from "lucide-svelte";

  export let data: PageData;
  $: pathname = $page.url.pathname;
</script>

<div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-6">
  {#each data.folders as folder (folder.name)}
    <Card
      class="
       relative flex items-center px-6 py-5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-200"
    >
      <div class="min-w-0 flex-1">
        <a href={`${pathname}/${folder.name}`} class="focus:outline-none">
          <span class="absolute inset-0" aria-hidden="true" />
          <span class="flex items-center">
            <Folder class="mr-2" />
            <p class="text-sm truncate font-medium text-white">{folder.name}</p>
          </span>
        </a>
      </div>
    </Card>
  {/each}
</div>
