//for the tests to work with different test accounts
const ITAcc = "testacc@up.edu.ph"
const AdminAcc = "testadmin@up.edu.ph"

const ITPass = "password"
const AdminPass = "adminpass"

//specific db instance for the tests.
//uses the same schema though since the schema has no runes.
//remember to clean up entries from this
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../src/lib/server/db/schema'

export const testDB = drizzle(neon(process.env.DATABASE_URL!), { schema });