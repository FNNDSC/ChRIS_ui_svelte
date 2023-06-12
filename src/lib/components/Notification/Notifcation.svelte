<script lang="ts">
  import { uploadStore } from "$lib/stores/uploadStore";
  import { Transition } from "svelte-transition";
  import ButtonIcon from "./ButtonIcon.svelte";
  import RadialProgress from "./RadialProgress.svelte";
  import { Check } from "lucide-svelte";
  import DisplayDetails from "./DisplayDetails.svelte";
</script>

<div
  aria-live="assertive"
  class="pointer-events-none
  fixed bottom-0 inset-x-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
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
        class="
            pointer-events-auto
            bg-gray-900
            w-full max-w-lg overflow-hidden rounded-lg shadow-lg ring-1 ring-white"
      >
        <div class="h-96 overflow-auto p-4">
          <div class="mr-2 flex flex-shrink-0">
            <p class="w-0 flex-1 font-medium truncate text-white">
              Your Notifications
            </p>

            <ButtonIcon
              on:click={() => uploadStore.toggleNotification()}
              text="Close"
              iconType="close"
            />
          </div>

          {#if $uploadStore.folderStatus.name}
            <DisplayDetails>
              <ButtonIcon slot="icon" text="Close" iconType="folder" />
              <p
                slot="key"
                class="w-0 flex-1 text-sm font-medium truncate text-white"
              >
                {$uploadStore.folderStatus.name}
              </p>

              <svelte:fragment slot="progress">
                {#if $uploadStore.folderStatus.done === $uploadStore.folderStatus.total}
                  <Check class="h-5 w-5 text-green-400" />
                {:else}
                  <p class="text-sm font-medium truncate text-gray-400">
                    {$uploadStore.folderStatus.done}/{$uploadStore.folderStatus
                      .total}
                  </p>
                {/if}
              </svelte:fragment>

              <ButtonIcon slot="close" text="" iconType="close" />
            </DisplayDetails>
          {/if}

          {#if $uploadStore.fileStatus.size > 0}
            {#each [...$uploadStore.fileStatus] as [key, value] (key)}
              <DisplayDetails>
                <ButtonIcon slot="icon" text="Close" iconType="file" />

                <p
                  slot="key"
                  class="w-0 flex-1 text-sm font-medium truncate text-white"
                >
                  {key}
                </p>

                <svelte:fragment slot="progress">
                  {#if value === 100}
                    <Check class="h-5 w-5 text-green-400" />
                  {:else}
                    <RadialProgress {value} />
                  {/if}
                </svelte:fragment>

                <ButtonIcon slot="close" text="" iconType="close" />
              </DisplayDetails>
            {/each}
          {/if}
        </div>
      </div>
    </Transition>
  </div>
</div>
