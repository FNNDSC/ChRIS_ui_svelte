<script>
	import { page } from '$app/stores';

	$: errorMessage = $page?.error?.message;
</script>

<h1 class='text-white'>{errorMessage}</h1>
