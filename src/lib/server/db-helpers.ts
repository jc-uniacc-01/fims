import { eq } from 'drizzle-orm';
import { db } from './db';

import { userrole } from './db/schema';

export async function assignRole(id: string, role: string) {
    await db.insert(userrole).values({
        userid: id,
        role,
    });

    return { success: true };
}

export async function getRole(id: string) {
    const [fetchedUser] = await db
        .select()
        .from(userrole)
        .where(eq(userrole.userid, id))
        .limit(1);

    return fetchedUser.role;
}
