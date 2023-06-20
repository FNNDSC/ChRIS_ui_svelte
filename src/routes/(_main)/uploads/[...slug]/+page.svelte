<script lang="ts">
  import axios from "axios";
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { LibraryCard, Dialog } from "$components/Library/";
  import { Button } from "$components/ui/button";
  import type { AxiosProgressEvent } from "axios";
  import type { FeedFile } from "@fnndsc/chrisapi";
  import type { PageData } from "./$types";
  import { Folder, File, X, Download } from "lucide-svelte";
  import { fetchClient } from "$lib/client";
  import { uploadStore } from "$lib/stores/uploadStore";

  export let data: PageData;
  let open = false;
  let fileInput: any;
  let folderInput: any;
  let newFolder: string;
  $: pathname = $page.url.pathname;
  $: currentPath = pathname.substring(9);
  let multipleSelected: string[] = [];

  function handleMultipleSelect(path: string, multiple: boolean) {
    if (multipleSelected.includes(path)) {
      multipleSelected = multiple
        ? multipleSelected.filter((existingPath) => existingPath !== path)
        : [];
    } else {
      multipleSelected = multiple ? [...multipleSelected, path] : [path];
    }
  }

  function clearSelected() {
    multipleSelected = [];
  }

  async function handleSubmit(files: FileList, isFolder: boolean) {
    const items = Array.from(files);
    const { client, token } = await clientSetup();
    const url = client.uploadedFilesUrl;

    uploadStore.newNotification();

    items.map(async (file, index) => {
      const formData = new FormData();
      const name = isFolder ? file.webkitRelativePath : file.name;
      formData.append("upload_path", `${currentPath}/${name}`);
      formData.append("fname", file, file.name);
      const controller = new AbortController();

      try {
        const config = {
          headers: { Authorization: "Token " + token },
          signal: controller.signal,
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent && progressEvent.progress) {
              const progress = Math.round(progressEvent.progress * 100);

              if (!isFolder) {
                uploadStore.setStatusForFiles(file.name, progress, controller);
              } else {
                if (progress === 100) {
                  const fileName = files[0].webkitRelativePath.split("/")[0];
                  uploadStore.setStatusForFolders(
                    fileName,
                    index + 1,
                    files.length,
                    controller
                  );
                }
              }
            }
          },
        };
        await axios.post(url, formData, config);
      } catch (error: any) {
        console.log(error.response.data || error.message);
      }
    });
    invalidateAll();
  }

  function handleFolderChange(e: any) {
    const folder = e.target.files;
    handleSubmit(folder, true);
  }

  function handleFileChange(e: any) {
    const files = e.target.files;
    handleSubmit(files, false);
  }

  function getFileName(file: FeedFile["data"]) {
    const fileNameArray = file.fname.split("/");
    const fileName = fileNameArray[fileNameArray.length - 1];
    return fileName;
  }

  async function clientSetup() {
    const token = data.token;
    const client = fetchClient(token);
    await client.setUrls();
    return { client, token };
  }

  async function createNewFolder() {
    const { client, token } = await clientSetup();

    if (!newFolder) {
      newFolder = "Untitled";
    }

    const content = "Welcome";
    const file = new Blob([content], { type: "text/plain" });
    const path = `${currentPath}/${newFolder}`;
    const formData = new FormData();
    formData.append("upload_path", `${path}/Welcome.txt`);
    formData.append("fname", file, "Welcome.txt");

    try {
      const config = {
        headers: { Authorization: "Token " + token },
      };
      await axios.post(client.uploadedFilesUrl, formData, config);
      invalidateAll();
    } catch (error) {
      console.log("Error", error);
    }

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
    <Download class="h4 w-4 cursor-pointer" />
  {/if}
</div>

<Dialog
  handleDialogToggle={() => {
    open = !open;
  }}
  bind:open
  bind:value={newFolder}
  handleSave={createNewFolder}
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
  {#each data.folders as folder (folder.name)}
    <LibraryCard
      type="folder"
      {multipleSelected}
      {handleMultipleSelect}
      path={`${pathname}/${folder.name}`}
    >
      <Folder class="mr-2" slot="icon" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {folder.name}
      </p>
    </LibraryCard>
  {/each}

  {#each data.files as file (file.fname)}
    <LibraryCard
      type="file"
      {multipleSelected}
      {handleMultipleSelect}
      path={`${pathname}/${getFileName(file)}`}
    >
      <File class="mr-2" slot="icon" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {getFileName(file) || ""}
      </p>
    </LibraryCard>
  {/each}
</div>
