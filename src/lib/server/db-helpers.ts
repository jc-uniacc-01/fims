import { eq, inArray } from 'drizzle-orm';

import { db } from './db';

import { appuser, changelog, faculty, role, userinfo } from './db/schema';

export async function logChange(makerid: string, tupleid: number, operation: string) {
    const logids = await db
        .insert(changelog)
        .values({
            userid: makerid,
            tupleid,
            operation,
            timestamp: new Date(),
        })
        .returning();

    const [{ logid }, _] = logids;

    return logid;
}

export async function makeUserInfo(makerid: string, id: string, role: string) {
    // Actual action
    const returnedIds = await db
        .insert(userinfo)
        .values({
            userid: id,
            role,
        })
        .returning();

    if (returnedIds.length === 0) return { success: false };

    // Log!
    const [{ userinfoid: tupleid }, _] = returnedIds;

    const logid = await logChange(makerid, tupleid, 'Made account.');

    await db
        .update(userinfo)
        .set({
            latestchangelogid: logid,
        })
        .where(eq(userinfo.userinfoid, tupleid));

    return { success: true };
}

export async function deleteUsersInfo(makerid: string, userids: string[]) {
    if (!userids || userids.length === 0) return { success: false };

    // Actual action
    const returnedIds = await db
        .delete(userinfo)
        .where(inArray(userinfo.userid, userids))
        .returning();

    if (returnedIds.length === 0) return { success: false };

    // Log!
    returnedIds.forEach(async ({ userinfoid: tupleid }) => {
        await logChange(makerid, tupleid, 'Deleted account.');
    });

    return { success: true };
}

export async function getRole(id: string) {
    const [fetchedUser] = await db.select().from(userinfo).where(eq(userinfo.userid, id)).limit(1);

    return fetchedUser.role;
}

export async function getPermissions(userRole: string) {
    const [fetchedRole] = await db.select().from(role).where(eq(role.role, userRole)).limit(1);

    return fetchedRole;
}

export async function areYouHere(email: string) {
    const you = await db.select().from(appuser).where(eq(appuser.email, email));

    return you.length !== 0;
}

export async function deleteFacultyRecords(makerid: string, ids: number[]) {
    if (!ids || ids.length === 0) return { success: false };

    // Actual action
    const returnedIds = await db.delete(faculty).where(inArray(faculty.facultyid, ids)).returning();

    if (returnedIds.length === 0) return { success: false };

    // Log!
    returnedIds.forEach(async ({ facultyid: tupleid }) => {
        await logChange(makerid, tupleid, 'Deleted account.');
    });

    return { success: true };
}

//made this to easily test faculty record selection and deletion
//only difference is that the last where is removed
//as the lack of changelogs removes everything
export async function getDummyFacultyRecordList() {
    /*
    const [currentSemester] = await db
        .select({
            acadsemesterid: semester.acadsemesterid,
        })
        .from(semester)
        .orderBy(desc(semester.academicyear))
        .limit(1);

    const shownFields = await db
        .select({
            facultyid: faculty.facultyid,
            lastname: faculty.lastname,
            firstname: faculty.firstname,
            status: faculty.status,
            ranktitle: rank.ranktitle,
            adminposition: adminposition.name,
            logTimestamp: changelog.timestamp,
            logMaker: appuser.email,
            logOperation: changelog.operation,
        })
        .from(rank)
        .rightJoin(facultyrank, eq(facultyrank.rankid, rank.rankid))
        .rightJoin(facultysemester, eq(facultysemester.currentrankid, facultyrank.facultyrankid))
        .rightJoin(faculty, eq(faculty.facultyid, facultysemester.facultyid))
        .leftJoin(
            facultyadminposition,
            eq(facultyadminposition.facultysemesterid, facultysemester.facultysemesterid),
        )
        .leftJoin(
            adminposition,
            eq(adminposition.adminpositionid, facultyadminposition.adminpositionid),
        )
        .leftJoin(changelog, eq(changelog.logid, faculty.latestchangelogid))
        .leftJoin(appuser, eq(appuser.id, changelog.userid))
    

    return shownFields;
    */
    return dummyRecordList;
}

// grabs an individual record
// made this as the faculty record list only gets display information
export async function getFacultyRecord(facultyID:number) {
    const query = await db
        .select()
        .from(faculty)
        .where(eq(faculty.facultyid, facultyID));

    return query[0];
}

// deletes a faculty record by id
export async function deleteFacultyRecord(facultyID:number) {
    /*
    await db
        .delete(faculty)
        .where(eq(faculty.facultyid, facultyID));
    */

    dummyRecordList = dummyRecordList.filter((rec) => rec.facultyid !== facultyID);
}
