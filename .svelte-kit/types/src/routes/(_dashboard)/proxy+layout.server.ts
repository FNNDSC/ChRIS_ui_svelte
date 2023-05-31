// @ts-nocheck
import type { LayoutServerLoad } from './$types';

// get `locals.user` and pass it to the `page` store
export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	return {
		user: locals.user
	};
};
