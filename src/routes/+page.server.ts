// Doing this in order to test db code

import {db} from "$lib/server/db";
import { accountRoles } from "$lib/server/schema";
import * as accountDAO from "$lib/server/accountDAO";

console.log(accountDAO.listAll());

console.log ("Page loaded")