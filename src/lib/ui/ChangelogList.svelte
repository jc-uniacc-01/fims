<script lang="ts">
    import type { Snippet } from "svelte";
	import ChangelogEntry from '$lib/ui/ChanglogEntry.svelte'

	type ChangelogRecordStructure = {
			
	}

	type Props={
		// basically a callback so that the component can be integrated anywhere since im not sure on future changes of this
		// should make it easier to implement pagination as well i think
		changelogFetcher: () => ChangelogRecordStructure[], 
	};

	let {changelogFetcher}:Props = $props();
</script>

<div data-testid="changelog-component" class="flex flex-col w-90">
	<!-- Header -->
	<div class="bg-fims-green text-white rounded-t-4xl">
		<h1 class="w-full text-center text-3xl font-semibold py-3">Change Logs</h1>
	</div>

	<!-- Entries -->
	<div>
		<ChangelogEntry timestamp={new Date()} email="test@up.edu.ph" info="Added test"/>
		<ChangelogEntry timestamp={new Date()} email="test@up.edu.ph" info="Added test"/>
		<ChangelogEntry timestamp={new Date()} email="test@up.edu.ph" info="Added test"/>
	</div>
</div>
