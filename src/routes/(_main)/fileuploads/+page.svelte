<script lang="ts">
  import { uploadStore } from "$lib/stores/uploadStore";
  import { fetchClient } from "$lib/client";
  import { Button } from "$components/ui/button/";
  import { Input } from "$components/ui/input";
  import { UploadList, ImageIcon, Label } from "$components/FileUpload/";
  import axios from "axios";
  import type { AxiosProgressEvent } from "axios";
  import type { PageData } from "./$types";
  import FileInput from "$components/FileUpload/FileInput.svelte";

  export let data: PageData;
  let files: FileList;
  let folder: FileList;
  let folderToDownload: string;

  function handleOnChange(e: any) {
    folder = e.target.files;
  }

  $: folderToDownload = folder && folder[0].webkitRelativePath.split("/")[0];

  let folderName = "";

  async function handleSubmit() {
    console.log("Handle Submit", handleSubmit);
    if (data.token) {
      const client = fetchClient(data.token);

      let isFolderUpload = folder ? true : false;
      let isFileUpload = files ? true : false;

      const items = isFolderUpload
        ? Array.from(folder)
        : isFileUpload
        ? Array.from(files)
        : [];

      if (items.length > 0) {
        const token = data.token;
        await client.setUrls();
        const url = client.uploadedFilesUrl;
        const directoryToUpload = `${data.user.name}/uploads/${
          folderName || "No-Name-Client"
        }/`;
        uploadStore.showNotification();
        isFolderUpload &&
          uploadStore.setFolderDetails(folder.length, folderToDownload);

        const filePromises = items.map((file, index) => {
          const formData = new FormData();
          const name = isFolderUpload ? file.webkitRelativePath : file.name;

          formData.append("upload_path", `${directoryToUpload}${name}`);
          formData.append("fname", file, file.name);

          try {
            const config = {
              headers: { Authorization: "Token " + token },
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent && progressEvent.progress) {
                  const progress = Math.round(progressEvent.progress * 100);
                  if (!isFolderUpload) {
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
      }
    }
  }

  function handleDelete(e: any) {
    e.preventDefault();
    const { item, itemType } = e.detail;

    if (itemType === "file") {
      files = Array.from(files).filter(
        (file) =>
          file.name !== item.name && file.lastModified !== item.lastModified
      ) as unknown as FileList;
    }

    if (itemType === "folder") {
      folder = null as unknown as FileList;
    }
  }
</script>

<form class="sm:ml-4 lg:ml-8">
  <div class="space-y-12">
    <div class="border-b border-white/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-white">File Uploads</h2>
      <p class="mt-1 text-sm leading-6 text-gray-400">
        This information will be displayed publicly so be careful what you
        share.
      </p>

      <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <Label labelFor="username" name="Folder Name" />

          <div class="mt-2">
            <div
              class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
            >
              <Input
                class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                bind:value={folderName}
              />
            </div>
          </div>
        </div>

        <div class="sm:col-span-4">
          <Label labelFor="cover-photo" name="Upload Your File" />

          <div
            class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10"
          >
            <div class="text-center">
              <ImageIcon />
              <div class="mt-4 flex text-sm leading-6 text-gray-400" />
            </div>
          </div>

          <div class="h-96 overflow-auto sm:col-span-4">
            <Label labelFor="upload-list" name="Your Attachments" />

            <div class="mt-2 text-sm text-white sm:col-span-2">
              <ul
                class="divide-y divide-white/10 rounded-md border border-white/20"
              >
                {#if files}
                  {#each Array.from(files) as file (file)}
                    <UploadList
                      on:delete={handleDelete}
                      name={file.name}
                      size={file.size}
                      item={file}
                      itemType="file"
                    />
                  {/each}
                {/if}

                {#if folder}
                  <UploadList
                    on:delete={handleDelete}
                    bind:name={folderToDownload}
                    size={0}
                    item={folder}
                    itemType="folder"
                  />
                {/if}

                {#if !folder && !files}
                  <li
                    class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  >
                    No attachments
                  </li>
                {/if}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex items-center gap-x-6">
      <Button variant="ghost">Cancel</Button>
      <Button on:click={handleSubmit} variant="default">Save</Button>
    </div>
  </div>
</form>
