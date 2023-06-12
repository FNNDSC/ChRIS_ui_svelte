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
  let open = false;
  let fileInput: any;
  let folderInput: any;
  let newFolder: string;
  $: pathname = $page.url.pathname;
  $: currentPath = pathname.substring(9);

  $: console.log($uploadStore);

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

  async function handleSubmit(folder: boolean, files: FileList) {
    const items = Array.from(files);
    const { client, token } = await clientSetup();

    const url = client.uploadedFilesUrl;
    uploadStore.newNotification();
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
        axios.post(url, formData, config);
      } catch (error: any) {
        console.log(error.response.data || error.message);
      }
    });

    await Promise.all(filePromises);
    invalidateAll();
  }
</script>

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
