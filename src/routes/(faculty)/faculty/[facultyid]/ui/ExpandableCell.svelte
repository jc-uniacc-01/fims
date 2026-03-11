<script lang="ts">
    import Icon from "@iconify/svelte";

    import RedButton from "$lib/ui/RedButton.svelte";
    import { viewState } from "../states/view-state.svelte";

    interface Props {
        name?: string;
        defaultValue?: string;
        immutable?: boolean;
        isDeleted?: boolean;
        value?: string;
    }

    // eslint-disable-next-line prefer-const -- changing value and bindable variable
    let { name, defaultValue, immutable, isDeleted, value = $bindable() }: Props = $props();

    let isDialogOpen = $state(false);
</script>

<div class="relative w-full flex items-center">
    <input type="text" defaultValue={defaultValue ?? ''} class="h-8 w-[90%] truncate border-0 focus:ring-0 {isDeleted ? 'text-fims-gray' : ''}" disabled />
    <button type="button" class="w-[10%] text-fims-gray bg-white hover:text-black h-8" onclick={() => (isDialogOpen = true)}>Expand</button>
</div>

{#if isDialogOpen}
    <div class="fixed top-0 left-0 z-150 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.9)]">
        <div class="h-[90%] w-[90%] rounded-2xl bg-white">
            <div class="flex items-center justify-end h-[7.5%] pr-2">
                <RedButton onclick={() => (isDialogOpen = false)}>
                    <Icon icon="tabler:x" class="h-5 w-5 mr-2" />
                    <span>Close</span>
                </RedButton>
            </div>
            <textarea
                class="whitespace-pre-wrap w-full h-[92.5%] {isDeleted ? 'text-fims-gray' : ''}"
                disabled={
                    !viewState.isEditing
                    || (immutable && defaultValue !== undefined && defaultValue !== '')
                    || isDeleted
                }
                defaultValue={defaultValue ?? ''}
                bind:value
                {name}
            ></textarea>
        </div>
    </div>
{/if}