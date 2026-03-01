<script>
    import { chooseSemestralRecord } from '../../states/chosen-semestral-record.svelte.js';

    const { data } = $props();
    const { acadYear, semestralRecord, semNum } = $derived(data);

    // Persist chosen semestral record
    $effect(() => (chooseSemestralRecord(acadYear, semNum)));
</script>
