// @ts-nocheck
import type { Action, Actions, PageServerLoad } from './$types';
import Client from '@fnndsc/chrisapi';
import { fail, error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const schema = z.object({
	username: z.string(),
	password: z.string()
});

export const load = async ({ locals, request }: Parameters<PageServerLoad>[0]) => {
	if (locals.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(request, schema);

	return { form };
};

const login: Action = async ({ cookies, request }: any) => {
	const form = await superValidate(request, schema);

	if (!form.valid) {
		return fail(400, { form });
	}

	const authURL = 'https://cube.chrisproject.org/api/v1/auth-token/';

	try {
		const token = await Client.getAuthToken(authURL, form.data.username, form.data.password);
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30
		});
	} catch (reason: any) {
		const data = reason.response.data;
		throw error(400, data);
	}

	throw redirect(302, '/');
};

export const actions = { login };
;null as any as Actions;