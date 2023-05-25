<script lang="ts">
	import InputGroup from '$lib/components/Form/InputGroup.svelte';
	import type { PageData } from './$types';

	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageData;

	let badRequest = {
		payload: {}
	};

	const {
		form: _form,
		errors,
		enhance
	} = superForm(data.form, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		onError({ result }) {
			badRequest.payload = result.error;
			badRequest = badRequest;
		}
	});

	$: usernameInvalid =
		$errors.username ||
		//@ts-ignore
		(badRequest.payload.username && badRequest.payload.username[0]);

	$: emailInvalid =
		$errors.email ||
		//@ts-ignore
		(badRequest.payload.email && badRequest.payload.email[0]);

	$: passwordInvalid =
		$errors.password ||
		//@ts-ignore
		(badRequest.payload.password && badRequest.payload.password[0]);
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-10 w-auto"
			src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
			alt="Your Company"
		/>
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
			Register here
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" action="?/register" method="POST" use:enhance>
			<InputGroup
				error={usernameInvalid ? true : false}
				errorMessage={usernameInvalid}
				bind:value={$_form.username}
				label="username"
				type="text"
			/>

			<InputGroup
				error={emailInvalid ? true : false}
				errorMessage={emailInvalid}
				bind:value={$_form.email}
				label="email"
				type="email"
			/>

			<InputGroup
				error={passwordInvalid ? true : false}
				errorMessage={passwordInvalid}
				bind:value={$_form.password}
				label="password"
				type="password"
			/>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>Sign in</button
				>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-400">
			Have an account already?
			<a href="/login" class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
				>Sign in</a
			>
		</p>
	</div>
</div>
