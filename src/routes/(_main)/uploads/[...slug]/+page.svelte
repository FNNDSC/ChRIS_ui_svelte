<script lang="ts">
  import axios from "axios";
  import type { AxiosProgressEvent } from "axios";
  import { page } from "$app/stores";
  import { LibraryCard, Dialog } from "$components/Library/";
  import { Button } from "$components/ui/button";
  import type { FeedFile } from "@fnndsc/chrisapi";
  import type { PageData } from "./$types";
  import { Folder, File } from "lucide-svelte";
  import { fetchClient } from "$lib/client";
  import { uploadStore } from "$lib/stores/uploadStore";
  import { invalidateAll } from "$app/navigation";

  export let data: PageData;
  let fileInput: any;
  let folderInput: any;

  $: pathname = $page.url.pathname;
  $: currentPath = pathname.substring(9);

  function handleFolderChange(e: any) {
    const folder = e.target.files;
    handleSubmit(true, folder);
  }

  function handleFileChange(e: any) {
    const files = e.target.files;
    handleSubmit(false, files);
  }

  function getFileName(file: FeedFile["data"]) {
    const fileNameArray = file.fname.split("/");
    const fileName = fileNameArray[fileNameArray.length - 1];
    return fileName;
  }

  function createNewFolder() {
    console.log("Creating");
  }

  async function handleSubmit(folder: boolean, files: FileList) {
    const token = data.token;
    const items = Array.from(files);

    const client = fetchClient(token);
    await client.setUrls();
    const url = client.uploadedFilesUrl;
    uploadStore.showNotification();
    const folderName = items[0].webkitRelativePath.split("/")[0];
    folder && uploadStore.setFolderDetails(items.length, folderName);

    const filePromises = items.map((file, index) => {
      const formData = new FormData();
      const name = folder ? file.webkitRelativePath : file.name;

      formData.append("upload_path", `${currentPath}/${name}`);
      formData.append("fname", file, file.name);

      try {
        const config = {
          headers: { Authorization: "Token " + token },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent && progressEvent.progress) {
              const progress = Math.round(progressEvent.progress * 100);
              if (!folder) {
                uploadStore.setStatusForFiles(file.name, progress);
              } else {
                if (progress === 100) {
                  uploadStore.setStatusForFolders(index + 1);
                }
              }
            }
          },
        };
        return axios.post(url, formData, config);
      } catch (error) {
        console.log(error);
      }
    });

    await Promise.all(filePromises);

    invalidateAll();
  }
</script>

<Dialog handleSave={createNewFolder} />
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
    <LibraryCard path={`${pathname}/${folder.name}`}>
      <Folder slot="icon" class="mr-2" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {folder.name}
      </p>
    </LibraryCard>
  {/each}

  {#each data.files as file (file.fname)}
    <LibraryCard path={""}>
      <File slot="icon" class="mr-2" />
      <p slot="name" class="text-sm truncate font-medium text-white">
        {getFileName(file) || ""}
      </p>
    </LibraryCard>
  {/each}
</div>
