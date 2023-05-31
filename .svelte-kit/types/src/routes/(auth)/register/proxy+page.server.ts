// @ts-nocheck
import type { PageServerLoad, Action, Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import Client from '@fnndsc/chrisapi';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const schema = z.object({
	username: z.string(),
	password: z.string(),
	email: z.string().email()
});

export const load = async (event: Parameters<PageServerLoad>[0]) => {
	const form = await superValidate(event, schema);
	return { form };
};

const register: Action = async ({ request }) => {
	const form = await superValidate(request, schema);

	if (!form.valid) {
		return fail(400, { form });
	}

	const userURL = 'https://cube.chrisproject.org/api/v1/users/';

	try {
		await Client.createUser(userURL, form.data.username, form.data.password, form.data.email);
	} catch (reason: any) {
		const data = reason.response.data;
		throw error(400, data);
	}

	throw redirect(303, '/login');
};

export const actions = { register };
;null as any as Actions;