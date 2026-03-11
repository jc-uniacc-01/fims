<script lang="ts">
    import { onMount } from "svelte";

    import { viewState } from "../states/view-state.svelte";

    interface Props {
        label: string;
        name: string;
        type?: string;
        defaultValue?: string;
        colStart?: number;
        colSpan?: number;
        immutable?: boolean;
    }

    const { label, name, type, defaultValue, colStart, colSpan, immutable }: Props = $props();

    let colStartClass = $derived(colStart === undefined ? '' : `col-start-${colStart}`);
    let colSpanClass = $derived(colSpan === undefined ? '' : `col-span-${colSpan}`);

    // Hacky way of preventing FOUC
    let domContainer: HTMLLabelElement | null = $state(null);
    onMount(() => {
        if (domContainer) domContainer.classList.remove('hidden');
    });

    // Safelist Tailwind classes
    // col-span-2
    // col-span-3
    // col-span-4
    // col-span-5
    // col-span-6
    // col-span-7
    // col-span-8
    // col-span-9
    // col-span-10
</script>

<label class="flex items-center justify-end w-full {colStartClass} {colSpanClass} hidden" bind:this={domContainer}>
    <span class="w-fit text-right mr-2">{label}</span>
    <input
        type={type ?? "text"} {name}
        class="h-8 w-45 2xl:w-75 rounded-sm border-0 bg-white p-1 placeholder-fims-gray focus:ring-0"
        placeholder="-"
        defaultValue={defaultValue ?? ''}
        disabled={!viewState.isEditing || (viewState.isEditing && immutable && defaultValue !== undefined && defaultValue !== '')}
    />
</label>