import { expect, test, beforeEach, beforeAll, afterEach, afterAll } from "vitest"
import { db } from "../src/lib/server/db"
import * as DBHelper from "$lib/server/db-helpers"
import { appuser } from "../src/lib/server/db/schema"
import { eq } from "drizzle-orm"
import * as AccountDAO from "../src/lib/server/accountDAO"
import { withNeonTestBranch } from "./backend/test-setup"

test("account listing", async () => {
    let accounts = await AccountDAO.listAll()
    expect(accounts.length).toBeGreaterThan(0)
    expect(accounts.find((elem) => {elem.accountId == "oP77pgWyY6fcUjyanDUbyPOWOr9eNSt1"})).not.toBe([]); //find test account
});

test("account creation and deletion", async () => {
    expect(await AccountDAO.createAcc("vitest@up.edu.ph", "Vitest Tester", "password", "IT")).toBeTruthy;
    let accounts = await AccountDAO.listAll() 
    expect(accounts.find((elem) => {elem.accountId == "oP77pgWyY6fcUjyanDUbyPOWOr9eNSt1"})).not.toBe([]); //find test account
});
