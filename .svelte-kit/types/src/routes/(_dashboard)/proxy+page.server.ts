// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, cookies }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
};
