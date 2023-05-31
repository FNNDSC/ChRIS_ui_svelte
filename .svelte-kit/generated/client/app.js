export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9')
];

export const server_loads = [2];

export const dictionary = {
		"/(_dashboard)": [~5,[2]],
		"/(_dashboard)/feeds": [~6,[2],[,3]],
		"/(_dashboard)/fileuploads": [~7,[2]],
		"/(auth)/login": [~8,[4]],
		"/(auth)/register": [~9,[4]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';