<script lang="ts">
  import { Card } from "$components/ui/card";
  import { createMenu } from "svelte-headlessui";
  import Transition from "svelte-transition";
  import Ellipse from "./Ellipse.svelte";

  export let path: string;

  const menu = createMenu({
    label: "Actions",
  });
</script>

<Card class="relative flex items-center px-6 py-5  hover:border-gray-200">
  <slot name="icon" />
  <div class="min-w-0 flex-1">
    <a href={path} class="focus:outline-none">
      <span class="absolute inset-0" aria-hidden="true" />
      <span class="flex items-center">
        <slot name="name" />
      </span>
    </a>
  </div>
  <div class="relative ml-auto">
    <button
      use:menu.button
      on:click|stopPropagation={() => console.log("clicked")}
      type="button"
      class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500"
      id="options-menu-0-button"
      aria-expanded="false"
      aria-haspopup="true"
    >
      <span class="sr-only">Open options</span>
      <Ellipse />
    </button>

    <Transition
      show={$menu.expanded}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div
        use:menu.items
        class="absolute right-0 z-10 ml-4 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu-0-button"
        tabindex="-1"
      >
        <div use:menu.item>
          <button
            on:click|stopPropagation={() => {
              console.log("Clicked Download");
              menu.close();
            }}
            use:menu.item
            class="bg-gray-100 block px-3 py-1 text-sm leading-6 text-gray-900"
            role="menuitem"
            tabindex="-1"
            id="options-menu-0-item-0">Download</button
          >
        </div>
      </div>
    </Transition>
  </div></Card
>