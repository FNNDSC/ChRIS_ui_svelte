<script lang="ts">
  import { page } from "$app/stores";
  import LibraryCard from "$components/Library/LibraryCard.svelte";
  import type { FeedFile } from "@fnndsc/chrisapi";
  import type { PageData } from "./$types";
  import { Folder, FileArchive } from "lucide-svelte";

  export let data: PageData;
  $: pathname = $page.url.pathname;

  function getFileName(file: FeedFile["data"]) {
    const fileNameArray = file.fname.split("/");
    const fileName = fileNameArray[fileNameArray.length - 1];
    return fileName;
  }
</script>

<div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-5">
  {#each data.folders as folder (folder.name)}
    <LibraryCard path={`${pathname}/${folder.name}`}>
      <Folder slot="icon" class="mr-2" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {folder.name}
      </p>
    </LibraryCard>
  {/each}

  {#each data.files as file (file.fname)}
    <LibraryCard path={""}>
      <FileArchive slot="icon" class="mr-2" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {getFileName(file) || ""}
      </p>
    </LibraryCard>
  {/each}
</div>
