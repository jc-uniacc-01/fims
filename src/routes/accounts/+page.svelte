<script>
  import Icon from "@iconify/svelte";
  import AccountRow from "./(ui)/AccountRow.svelte";
  let { data, form } = $props();
  let { accountList } = $derived(data);
</script>


{#if form?.error}
  <div
    class="fixed bottom-3 right-3 flex h-8 w-125 items-center rounded-lg border-2 border-fims-red bg-fims-red-100 px-4 py-6"
  >
    <Icon icon="tabler:alert-hexagon" class="h-6 w-6 text-fims-red" />
    <p class="px-8">{form.error}</p>
  </div>
{/if}

<br />

{#if form?.message}
  {#if form?.success}
    <div
      class="fixed bottom-3 right-3 flex h-8 w-125 items-center rounded-lg border-2 border-fims-green bg-fims-green-100 px-4 py-6"
    >
      <Icon icon="tabler:alert-hexagon" class="h-6 w-6 text-fims-green" />
      <p class="px-8">{form.message}</p>
    </div>
  {:else}
    <div
      class="fixed bottom-3 right-3 flex h-8 w-125 items-center rounded-lg border-2 border-[#ceb676] bg-fims-beige px-4 py-6"
    >
      <Icon icon="tabler:alert-hexagon" class="h-6 w-6 text-[#ceb676]" />
      <p class="px-8">{form.message}</p>
    </div>
  {/if}
{/if}

<div>
  <!-- Account List Table -->
  <div class="mt-60">
    <!-- Header -->
    <div class="flex justify-center [&>div]:flex [&>div]:items-center [&>*>span]:font-semibold [&>*>span]:text-white [&>*>span]:text-center [&>div]:bg-fims-red [&>div]:h-12 [&>div]:px-6">
      <div class="justify-center w-25"><span>Select</span></div>
      <div class="w-132">
        <span>Email</span>
      </div>
      <div class="justify-center w-50"><span>Reset Password?</span></div>
      <div class="justify-center w-75">
        <span>Type</span>
      </div>
      <div class="justify-center w-100"><span>Change Logs</span></div>
      <div class="justify-center w-50"><span>Account Action</span></div>
    </div>

    <!-- Rows -->
    {#each accountList as account (account.userid)}
      <AccountRow {account} />
    {/each}
  </div>
</div>

<form method="POST" action="?/makeAccount" class="mt-20">
  <input type="email" name="email" placeholder="Email" class="h-12 w-50 border-2 rounded-lg p-1" />
  <input type="password" name="password" placeholder="Password" class="h-12 w-50 border-2 rounded-lg p-1" />
  <input type="role" name="role" placeholder="Role" class="h-12 w-35 border-2 rounded-lg p-1" />
  <button type="submit" class="border-2 rounded-lg border-fims-green w-25 h-12 text-fims-green hover:bg-fims-green-100">Submit</button>
</form>