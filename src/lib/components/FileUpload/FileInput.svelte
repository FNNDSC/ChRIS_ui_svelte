<script lang="ts">
  export let isDirectory: boolean;
  export let heading: string;
  export let label: string;
  export let files: FileList;
  export let multiple: boolean;
</script>

<label
  for={label}
  class="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
>
  <span>{heading}</span>
  <input
    id={label}
    name={label}
    type="file"
    class="sr-only"
    bind:files
    webkitdirectory={isDirectory ? true : null}
    {multiple}
  />
</label>
