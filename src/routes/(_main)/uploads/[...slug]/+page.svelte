<script lang="ts">
  import { Folder, File, X, Download } from "lucide-svelte";
  import { page } from "$app/stores";
  import { LibraryCard, Dialog } from "$components/Library/";
  import { Button } from "$components/ui/button";
  import {
    handleUpload,
    handleFileDownload,
    handleFolderDownload,
    createNewFolder,
    getFileName,
  } from "$lib/utilities/library";
  import type { PageData } from "./$types";

  export let data: PageData;
  let open = false;
  let fileInput: any;
  let folderInput: any;
  let newFolder: string;
  let multipleSelected: {
    path: string;
    type: string;
  }[] = [];
  $: pathname = $page.url.pathname;
  $: currentPath = pathname.substring(9);
  $: ({ folders, files } = data);

  function handleMultipleSelect(path: string, multiple: boolean, type: string) {
    const findIndex = multipleSelected.find(
      (selected) => selected.path === path
    );

    if (findIndex) {
      multipleSelected = multiple
        ? multipleSelected.filter((existingPath) => existingPath.path !== path)
        : [];
    } else {
      multipleSelected = multiple
        ? [...multipleSelected, { path, type }]
        : [{ path, type }];
    }
  }

  function clearSelected() {
    multipleSelected = [];
  }

  function handleMultipleDownload() {
    multipleSelected.map((selected) => {
      if (selected.type === "folder") {
        handleFolderDownload(
          {
            name: getFileName(selected.path),
            path: selected.path.substring(9),
          },
          data.token
        );
      }

      if (selected.type === "file") {
        handleFileDownload(
          {
            fname: selected.path.substring(9),
          },
          data.token
        );
      }
    });
  }

  function handleFolderChange(e: any) {
    const folder = e.target.files;
    handleUpload(folder, true, currentPath, data.token);
  }

  function handleFileChange(e: any) {
    const files = e.target.files;
    handleUpload(files, false, currentPath, data.token);
  }

  async function createFolder() {
    if (!newFolder) {
      newFolder = "Untitled";
    }
    createNewFolder(newFolder, currentPath, data.token);
    open = !open;
    newFolder = "";
  }
</script>

<div class="flex h-8 mb-2 items-center">
  {#if multipleSelected.length > 0}
    <Button class="mr-4" on:click={clearSelected} variant="outline">
      <X class="h4 w-4" />
    </Button>

    <span class="mr-4">{multipleSelected.length} selected</span>
    <Button on:click={handleMultipleDownload} variant="outline">
      <Download class="h4 w-4 cursor-pointer" />
    </Button>
  {/if}
</div>

<Dialog
  handleDialogToggle={() => {
    open = !open;
  }}
  bind:open
  bind:value={newFolder}
  handleSave={createFolder}
/>

<Button
  variant="outline"
  on:click={() => {
    fileInput.click();
  }}>Upload Files</Button
>

<Button
  variant="outline"
  on:click={() => {
    folderInput.click();
  }}>Upload Folder</Button
>

<input
  bind:this={fileInput}
  on:change={handleFileChange}
  multiple={true}
  style="display:none"
  type="file"
/>

<input
  bind:this={folderInput}
  on:change={handleFolderChange}
  style="display:none"
  type="file"
  webkitdirectory
/>

<div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-5">
  {#each folders as folder (folder.name)}
    <LibraryCard
      type="folder"
      {multipleSelected}
      {handleMultipleSelect}
      handleDownload={() => {
        handleFolderDownload(folder, data.token);
      }}
      path={`${pathname}/${folder.name}`}
    >
      <Folder class="mr-2" slot="icon" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {folder.name}
      </p>
    </LibraryCard>
  {/each}

  {#each files as file (file.fname)}
    <LibraryCard
      type="file"
      {multipleSelected}
      {handleMultipleSelect}
      handleDownload={() => {
        handleFileDownload(file, data.token);
      }}
      path={`${pathname}/${getFileName(file.fname)}`}
    >
      <File class="mr-2" slot="icon" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {getFileName(file.fname) || ""}
      </p>
    </LibraryCard>
  {/each}
</div>
