import { expect, test} from "@playwright/test"
import { db } from "$lib/server/db"
import { appuser } from "$lib/server/db/schema"
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";


const TEST_ACC_EMAIL = "testacc@up.edu.ph"; //must have an it acocunt that has acocunt editing/viewing permissions
const TEST_ACC_PASS = "password";

const NON_IT_TEST_EMAIL = "testadmin@up.edu.ph";
const NON_IT_TEST_PASS = "adminpass"
const FAIL_ROUTE = "/login?/signInEmail"

/*
const AUTH_CLIENT = await createAuthClient({
    baseURL: "https://localhost:5173",
    plugins: [
        adminClient()
    ]
});

let testID:string

test.beforeAll(async () => {
    // check if there is already an existing vitest account
    let testAccID:string|null = null

    let accList = await db
    .select({
        id: appuser.id,
        email: appuser.email
    }).from(appuser)

    if (accList.length > 0) {
        let fetchedAcc = accList.find((e) => {e.email ==  TEST_ACC_EMAIL});
        if (fetchedAcc) {
           testAccID = fetchedAcc.id 
        }
    }
 
    if (testAccID) {
        // delete current test account before moving on
        await AUTH_CLIENT.admin.removeUser({userId: testAccID});
    }

    //create test account in order
    let testUser = await AUTH_CLIENT.admin.createUser({
        email: TEST_ACC_EMAIL,
        password: "password",
        name: "Vitest Acc",
    });
    testID = testUser.data!.user.id
})

test.afterAll(async () => {
    await AUTH_CLIENT.admin.removeUser({userId: testID})
})
    */

test("viewing accounts as IT", async ({page}) => {
    await page.goto("/login");

    await page.locator("#email").fill(TEST_ACC_EMAIL);
    await page.locator("#password").fill(TEST_ACC_PASS);
    await page.locator("#password").press("Enter")

    await page.getByText("Accounts").click()

    //not sure but i can't find a specific id for the account div, so i'm basing it off the first col name
    //this locator locates the parents twice up
    //failure should be caused by timeout as it can't find it
    await expect(page.getByText("Select").locator("..").locator("..")).not.toBeEmpty();
    await expect(page.getByText("testadmin@up.edu.ph")).toBeVisible(); //should check the other account
})

test("creating accounts as IT", async ({page}) => {

});

test("deleting accounts as IT", async ({page}) => {

});

test("attempt to do anything account related as non-IT", async ({page}) => {
    await page.goto("/login");

    await page.locator("#email").fill(NON_IT_TEST_EMAIL);
    await page.locator("#password").fill(NON_IT_TEST_PASS);
    await page.locator("#password").press("Enter");

    await page.getByText("Accounts").click();

    await expect(page.getByText("404")).toBeVisible();
});