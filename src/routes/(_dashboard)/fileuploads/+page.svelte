<script lang="ts">
  import { uploadStatus } from "$lib/stores/uploadStore";
  import { fetchClient } from "$lib/utils/client";
  import axios from "axios";
  import type { AxiosProgressEvent } from "axios";
  import type { PageData } from "./$types";

  export let data: PageData;
  let files: FileList;
  let folderName = "";

  async function handleSubmit() {
    if (data.token) {
      const client = fetchClient(data.token);
      const token = data.token;
      await client.setUrls();
      const url = client.uploadedFilesUrl;
      const fileList = Array.from(files) as File[];
      const directoryToUpload = `${data.user.name}/uploads/${
        folderName || "No-Name-Client"
      }/`;
      const filePromises = fileList.map((file) => {
        const formData = new FormData();
        const name = file.name;
        formData.append("upload_path", `${directoryToUpload}${file.name}`);
        formData.append("fname", file, name);

        try {
          const config = {
            headers: { Authorization: "Token " + token },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              if (progressEvent && progressEvent.progress) {
                const progress = Math.round(progressEvent.progress * 100);
                uploadStatus.setStatus(file.name, progress);
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
</script>

<form class="sm:ml-4 lg:ml-8" on:submit|preventDefault={handleSubmit}>
  <div class="space-y-12">
    <div class="border-b border-white/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-white">File Uploads</h2>
      <p class="mt-1 text-sm leading-6 text-gray-400">
        This information will be displayed publicly so be careful what you
        share.
      </p>
      4

      <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label
            for="username"
            class="block text-sm font-medium leading-6 text-white"
            >Folder Name</label
          >
          <div class="mt-2">
            <div
              class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
            >
              <input
                type="text"
                name="foldername"
                id="foldername"
                class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="janesmith"
                bind:value={folderName}
              />
            </div>
          </div>
        </div>

        <div class="sm:col-span-4">
          <label
            for="cover-photo"
            class="block text-sm font-medium leading-6 text-white"
            >Upload Your File</label
          >
          <div
            class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10"
          >
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="mt-4 flex text-sm leading-6 text-gray-400">
                <label
                  for="file-upload"
                  class="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    class="sr-only"
                    multiple
                    bind:files
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs leading-5 text-gray-400">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div class="sm:col-span-4">
          <label
            for="cover-photo"
            class="block text-sm font-medium leading-6 text-white"
            >Your Attachments</label
          >
          <div class="mt-2 text-sm text-white sm:col-span-2">
            <ul
              class="divide-y divide-white/10 rounded-md border border-white/20"
            >
              {#if files}
                {#each Array.from(files) as file (file.name)}
                  <li
                    class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  >
                    <div class="flex w-0 flex-1 items-center">
                      <svg
                        class="h-5 w-5 flex-shrink-0 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="ml-4 flex min-w-0 flex-1 gap-2">
                        <span class="truncate font-medium">{file.name}</span>
                        <span class="flex-shrink-0 text-gray-400"
                          >{file.size}</span
                        >
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <a
                        href="/"
                        class="font-medium text-indigo-400 hover:text-indigo-300"
                        >Delete</a
                      >
                    </div>
                  </li>
                {/each}
              {:else}
                <li
                  class="
                  flex
                  items-center
                  justify-between
                  py-4
                  pl-4
                  pr-5
                  text-sm
                  leading-6"
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

  <div class="mt-6 flex items-center gap-x-6">
    <button type="button" class="text-sm font-semibold leading-6 text-white"
      >Cancel</button
    >
    <button
      type="submit"
      class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >Save</button
    >
  </div>
</form>
