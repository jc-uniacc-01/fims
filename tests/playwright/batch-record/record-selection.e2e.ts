import { expect, test } from '@playwright/test';

test.describe("batch record deletion as it", async() => {
    test.use({storageState: 'playwright/.auth/admin.json'})
})