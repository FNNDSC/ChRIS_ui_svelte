<script lang="ts">
  import { uploadStatus } from "$lib/stores/uploadStore";
  import { Transition } from "svelte-transition";
</script>

<div
  aria-live="assertive"
  class="pointer-events-none fixed bottom-0 inset-x-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
>
  <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
    <Transition
      show={true}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="ml-3 w-0 flex-1 pt-0.5">
              {#each [...$uploadStatus] as [key, value]}
                <p class="mt-1 text-sm text-gray-500">
                  {key} - {value}
                </p>
              {/each}

              <div class="mt-3 flex space-x-7">
                <button
                  type="button"
                  class="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >Undo</button
                >
                <button
                  type="button"
                  class="rounded-md bg-white text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >Dismiss</button
                >
              </div>
            </div>
            <div class="ml-4 flex flex-shrink-0">
              <button
                on:click={() => {
                  uploadStatus.reset();
                }}
                type="button"
                class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</div>
