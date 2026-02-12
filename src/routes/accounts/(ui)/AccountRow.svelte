<script lang="ts">
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";

  interface AccountDTO {
    email: string;
    role: string | null;
    userid: string;
    logTimestamp: string | null;
    logOperation: string | null;
    logMaker: string | null;
  }

  interface Props {
    account: AccountDTO;
  }

  let { account }: Props = $props();
  let { email, role, userid, logTimestamp, logOperation, logMaker }: AccountDTO = $derived(account);

  const userRoles = ['IT', 'Admin'];
</script>

<div class="flex justify-center [&>div]:border-b [&>div]:border-fims-gray [&>div]:flex [&>div]:items-center [&>div]:h-12 [&>div]:px-6 [&>div]:bg-white">
  <div class="justify-center w-25"><input type="checkbox" class="w-5 h-5" /></div>
  <div class="w-132"><span>{email}</span></div>
  <div class="justify-center w-50"><form method="POST" action="?/deleteAccount" class="flex justify-center items-center">
      <button
        type="submit" name="userid" value={userid}
        class="flex items-center justify-center rounded-full border-2 border-fims-red bg-white px-4 py-1 text-fims-red hover:bg-fims-red hover:text-white disabled:border-fims-gray disabled:text-fims-gray"
      >
        <Icon icon="tabler:refresh" class="h-6 w-6 mr-2" />
        <span>Reset</span>
      </button>
    </form></div>
  <div class="w-75">
    <form
      method="POST"
      action=""
      class="w-full"
    >
      <select
        name="role"
        class="w-full text-center"
      >
        {#each userRoles as userRole}
          {#if userRole === role}
            <option value={userRole} selected>{userRole}</option>
          {:else}
            <option value={userRole}>{userRole}</option>
          {/if}
        {/each}
      </select>
    </form>
  </div>
  <div class="w-100">
    <span class="text-">{logMaker} ({logTimestamp}): {logOperation}</span>
  </div>
  <div class="justify-center w-50">
    <form
      method="POST"
      action="?/deleteAccount"
      class="flex justify-center items-center"
      use:enhance
    >
      <button
        type="submit" name="userid" value={userid}
        class="flex items-center justify-center rounded-full border-2 border-fims-red bg-white px-4 py-1 text-fims-red hover:bg-fims-red hover:text-white disabled:border-fims-gray disabled:text-fims-gray"
      >
        <Icon icon="tabler:trash" class="h-6 w-6 mr-2" />
        <span>Delete</span>
      </button>
    </form>
  </div>
</div>