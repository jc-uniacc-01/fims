<script>
    import { chooseSemestralRecord } from '../../states/chosen-semestral-record.svelte.js';
    import { resetViewState } from '../../states/view-state.svelte.js';

    const { data } = $props();
    const { acadYear, semestralRecord, semNum } = $derived(data);

    // Ensure view isn't set to editing state on load
    resetViewState();

    // Persist chosen semestral record
    $effect(() => (chooseSemestralRecord(acadYear, semNum)));
</script>
