import { expect, test, beforeEach, beforeAll, afterEach, afterAll } from "vitest"
import { db } from "../src/lib/server/db"
import * as DBHelper from "$lib/server/db-helpers"
import { appuser } from "../src/lib/server/db/schema"
import * as AccountDAO from "../src/lib/server/accountDAO"
import { auth } from "$lib/server/auth"

const TEST_ACC_ID = "oP77pgWyY6fcUjyanDUbyPOWOr9eNSt1"

let testUser;
let testID:string

beforeAll(async () => {
    testUser = await auth.api.signUpEmail({
        body: {
            email: "__vitest@up.edu.ph",
            name: "Vitest Testing",
            password: "vite"
        }
    }) 
    testID = testUser.user.id
})

afterAll(async () => {
    AccountDAO.deleteAcc(testID);
})

//very weak test case atm
test("account listing", async () => {
    let accounts = await AccountDAO.listAll()
    expect(accounts.length).toBeGreaterThan(0)
    expect(accounts.find((elem) => {elem.accountId == "testID"})).not.toBe([]); //find test account
});

test("account creation and deletion", async () => {
    let newUser = DBHelper.makeUser(testID, "sampleID", "IT");
});
