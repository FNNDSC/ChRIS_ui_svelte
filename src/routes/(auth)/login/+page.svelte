<script lang="ts">
  import Button from "$components/ui/button/Button.svelte";
  import InputGroup from "$lib/components/Form/InputGroup.svelte";

  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";

  export let data: PageData;

  let badRequest = {
    payload: {},
  };

  const {
    form: _form,
    errors,
    enhance,
  } = superForm(data.form, {
    autoFocusOnError: "detect",
    scrollToError: "smooth",
    applyAction: true,
    invalidateAll: true,
    resetForm: true,
    multipleSubmits: "prevent",
    onError({ result }) {
      console.log("result", result);
      badRequest.payload = result.error;
      badRequest = badRequest;
    },
  });

  $: usernameInvalid =
    $errors.username ||
    //@ts-ignore
    (badRequest.payload.username && badRequest.payload.username[0]);

  $: passwordInvalid =
    $errors.password ||
    //@ts-ignore
    (badRequest.payload.password && badRequest.payload.password[0]);

  //@ts-ignore
  $: serverError = badRequest.payload.message;
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img
      class="mx-auto h-10 w-auto"
      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
      alt="Your Company"
    />
    <h2
      class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white"
    >
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form action="?/login" class="space-y-6" method="POST" use:enhance>
      <InputGroup
        error={usernameInvalid ? true : false}
        errorMessage={usernameInvalid}
        bind:value={$_form.username}
        label="User Name"
        type="text"
        name='username'
      />

      <div>
        <InputGroup
          error={passwordInvalid ? true : false}
          errorMessage={passwordInvalid}
          bind:value={$_form.password}
          label="Password"
          type="password"
          name='password'
        />
      </div>

      {#if serverError}
        <p class="mt-2 text-sm text-red-600" id="email-error">{serverError}</p>
      {/if}

      <div>
        <Button type="submit" class="w-full">Sign in</Button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-400">
      Not a member?
      <Button href="/register" variant="link">Register here</Button>
    </p>
  </div>
</div>
