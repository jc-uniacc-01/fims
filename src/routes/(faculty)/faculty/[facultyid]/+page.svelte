<script lang="ts">
    import Icon from "@iconify/svelte";
    import GreenButton from "$lib/ui/GreenButton.svelte";
    import RedButton from "$lib/ui/RedButton.svelte";
    import DeleteConfirmation from "$lib/ui/DeleteConfirmation.svelte";
    import LoadingScreen from "$lib/ui/LoadingScreen.svelte";

    import { enhance } from "$app/forms";
    import { page } from "$app/state";

    let { data, form } = $props();
    const { lastname, firstname } = $derived(data);

    let willDelete = $state(false);
    let isLoading = $state(false);

    let deleteForm: HTMLFormElement | null = $state(null);
</script>

{#if form?.error}
    <div
        class="fixed right-3 bottom-3 flex h-8 w-125 items-center rounded-lg border-2 border-fims-red bg-fims-red-100 px-4 py-6"
    >
        <Icon icon="tabler:alert-hexagon" class="h-6 w-6 text-fims-red" />
        <p class="px-8">{form.error}</p>
    </div>
{/if}

<div>
    <a href="/" class="text-fims-green flex items-center h-7">
        <Icon icon="line-md:arrow-left-circle" class="h-6 w-6 mr-2" />
        <span class="underline">Back to List of Faculty Records</span>
    </a>
    <h1 class="text-3xl text-fims-green font-semibold mt-8" id="name-display">{lastname}, {firstname}</h1>
    <div class="mt-4 flex justify-between">
        <GreenButton>
            <Icon icon="tabler:file-export" class="mr-2 h-5 w-5" />
            <span>Export Reports</span>
        </GreenButton>
        <RedButton onclick={() => (willDelete = true)}>
            <Icon icon="tabler:trash" class="mr-2 h-6 w-6" />
            <span>Delete Record</span>
        </RedButton>
    </div>
</div>

{#if willDelete}
    <form
        method="post"
        action="?/delete"
        bind:this={deleteForm}
        use:enhance={() => {
            willDelete = false;
            isLoading = true;
            return async ({ update }) => {
                await update();
                isLoading = false;
            };
        }}
    >
        <input type="hidden" name="facultyid" value={page.params.facultyid} />

        <DeleteConfirmation
            onDelete={() => {
                if (deleteForm) deleteForm.requestSubmit();
            }}
            onCancel={() => (willDelete = false)}
            text="This will delete the current faculty record. Are you sure?"
        />
    </form>
{/if}

{#if isLoading}
    <LoadingScreen />
{/if}