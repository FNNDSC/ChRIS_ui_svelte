// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				name: string;
			};
		}
	}
}

declare module 'svelte-headlessui'
declare module 'svelte-transition'

export {};
