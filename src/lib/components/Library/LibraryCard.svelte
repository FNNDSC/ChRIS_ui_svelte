<script lang="ts">
  import { Card } from "$components/ui/card";
  export let path: string;

 
</script>

<Card
  class="relative flex items-center px-6 py-5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-200"
>
  <slot name="icon" />
  <div class="min-w-0 flex-1">
    <a href={path} class="focus:outline-none">
      <span class="absolute inset-0" aria-hidden="true" />
      <span class="flex items-center">
        <slot name="name" />
      </span>
    </a>
  </div>
</Card>
