<script lang="ts">
	export let error: boolean;
	export let errorMessage: string;
	export let value: string;
	export let label: string;
	export let type: string;

	function typeAction(node: any) {
		node.type = type;
	}
</script>

<div>
	<label for={label} class="block text-sm font-medium leading-6 text-white">Username</label>
	<div class="relative mt-2 rounded-md shadow-sm">
		<input
			id={label}
			name={label}
			autocomplete="username"
			required
			use:typeAction
			data-invalid={error ? true : false}
			bind:value
			class="block w-full rounded-md text-white border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
             {error ? 'focus:ring-red-500 ring-red-300' : 'focus:ring-indigo-500 ring-white/10'}"
		/>
		{#if error}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<svg
					class="h-5 w-5 text-red-500"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>{/if}
	</div>
	{#if error}
		<p class="mt-2 text-sm text-red-600" id="email-error">{errorMessage}</p>
	{/if}
</div>
