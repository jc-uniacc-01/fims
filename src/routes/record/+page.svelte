<script lang="ts">
    import Profile from "./(tabs)/Profile.svelte";
    import { goto } from '$app/navigation';

    let { data } = $props();
    const { recordData } = $derived(data);

    if (!recordData) goto('/');


    const tabs = ["Profile"]
    const href = "/record";
    const back = "/";
    const firstName = recordData!.firstName;
    const lastName = recordData!.lastName;
</script>

<br/>

<!-- currently testing components -->
<div class="mt-20 text-fims-green px-5">
    <a href={back} class="text-fims-green">Back to List of Faculty Records</a>
    <h1 class="text-3xl font-semibold mb-[65px]" id="name-display">{lastName}, {firstName}</h1>
    <div class= "flex">
        {#each tabs as tab}
            <div class="flex px-4 h-fit w-fit border-x-2 border-t-2 rounded-t-xl items-center text-xl">
                <a {href} class="text-center w-mx m-auto">{tab}</a>
            </div>
        {/each}
    </div>
    <div id="divider" class="h-0.5 mb-10 w-full bg-fims-green"></div>
    <Profile/>
    <!-- TODO: some hacky way of mimicking the ui in figma-->
</div>