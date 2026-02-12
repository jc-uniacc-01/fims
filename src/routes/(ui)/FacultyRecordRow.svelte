<script lang="ts">
  interface FacultyRecordDTO {
    lastname: string;
    firstname: string;
    status: string;
    ranktitle: string;
    adminposition: string;
    logTimestamp: string;
    logMaker: string;
    logOperation: string;
  }

  interface Props {
    facultyRecord: FacultyRecordDTO;
    canViewChangeLogs: boolean;
  }

  let { facultyRecord, canViewChangeLogs }: Props = $props();
  let {
    lastname,
    firstname,
    status,
    ranktitle,
    adminposition,
    logTimestamp,
    logMaker,
    logOperation
  }: FacultyRecordDTO = $derived(facultyRecord);
</script>

<div class="flex justify-center [&>div]:border-b [&>div]:border-fims-gray [&>div]:flex [&>div]:items-center [&>div]:h-12 [&>div]:px-6 [&>div]:bg-white">
  <div class="justify-center w-25"><input type="checkbox" class="w-5 h-5" /></div>
  <div class="{canViewChangeLogs ? 'w-132' : 'w-182'}"><span>{lastname}, {firstname}</span></div>
  <div class="w-75 justify-center"><span>{status}</span></div>
  <div class="w-75 justify-center"><span>{ranktitle}</span></div>
  <div class="w-75 justify-center"><span>{adminposition}</span></div>
  {#if canViewChangeLogs}
    <div class="w-50">
      <span class="text-[#535353] truncate">{logMaker} ({logTimestamp}): {logOperation}</span>
    </div>
  {/if}
</div>