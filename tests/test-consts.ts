// external files
import * as seedData from './seed-data/faculty-admin';

//for the tests to work with different test accounts
export const ITAcc = 'it@up.edu.ph';
export const AdminAcc = 'admin@up.edu.ph';

export const ITPass = 'password';
export const AdminPass = 'password';

export const ITConfig = 'playwright/.auth/it.json';
export const AdminConfig = 'playwright/.auth/admin.json';

// for editing records
// currently untested fields:
// - fieldsofinterest
export function getFieldTest() {
    return {
        firstname: 'test-name',
        lastname: 'test=name2',
        middlename: 'test-name3',
        suffix: 'A',
        birthdate: new Date(),
        maidenname: 'maiden-name',
        philhealth: `${Math.floor(Math.random()*9999)}`,
        pagibig: `${Math.floor(Math.random()*9999)}`,
        psiitem: `${Math.floor(Math.random()*9999)}`,
        tin: `${Math.floor(Math.random()*9999)}`,
        gsisbp:`${Math.floor(Math.random()*9999)}`,
        empnum: `${Math.floor(Math.random()*9999)}`,
        status: expectedStatuses[Math.floor(Math.random()*3)],
        dateoforiginalappointment: new Date(),
        promHist: {
            rankofrenewalortenure: 'Insstructor 1', //todo: random picking of roles
            salarygrade: '10-2',
            salaryrate: '100000.00',
            appointmentstatus: 'Tenured',
            dateoftenureorrenewal: new Date(),
        },
        remarks: 'wow',
        emails: ['test@up.edu.ph'],
        contactnums: ['1234567890'],
        homeaddrs: ['up street'],
        eduattain: [{
            degree:'BS Test Degree',
            institution:'UP Diliman',
            year: '3000',
        }],
    };
};

//note: just choose the first office if needed
export function samplePosition() {
    return {
        position: 'Department Head',
        startdate: new Date(),
        enddate: new Date(),
        credit: 2
    };
}

export function sampleMembership() {
    return {
        natureofmembership: 'membership-test',
        comittee: 'test committee',
        startdate: new Date(),
        enddate: new Date(),
        credit: 2,
    };
}

export function sampleAdminWork() {
    return {
        natureofadminwork: 'admin-test',
        startdate: new Date(),
        enddate: new Date(),
        credit: 2,
    };
}

export function sampleClass() {
    return {
        course: 'Econ 11',
        section: 'Section ABC',
        studentnum: '11',
        credit: 2,
        SET: 5.0000
    };
}

export function sampleMentor() {
    return {
        menteelast: 'Lastname',
        menteefirst: 'Firstname',
        menteemiddle: 'Middlename',
        category: 'Test Category',
        startdate: new Date(),
        enddate: new Date(),
        credit: 2
    };
}

export function sampleResearch() {
    return {
        title: 'Title Testing',
        startDate: new Date(),
        endDate: new Date(),
        funding: '100000.00',
        credit: 2,
        remarks: 'testmark',
    };
}

export function sampleExt() {
    return {
        natureofext: 'Test Extension',
        agency: 'Test Agency',
        startdate: new Date(),
        enddate: new Date(),
        credit: 2,
    };
}

export function sampleStudy() {
    return {
        degree:'BS More Test',
        uni: 'UP Diliman 2',
        units: 20,
        isLeaveWithPay: Math.random() < 0.5,
        isRecipientofFF: Math.random() < 0.5,
        credit:2,
    };
}

//todo: proper types
export function getSemestralRecordTest(
    expectedPosition:any,
    expectedMembership:any,
    expectedAdminWork:any,
    expectedclass:any,
    expectedmentor:any,
    expectedResearch:any,
    expectedExt:any,
    expectedStudy:any,
) {
    return {
        position: expectedPosition,
        membership: expectedMembership,
        adminwork: expectedAdminWork,
        classes: expectedclass,
        mentors: expectedmentor,
        research: expectedResearch,
        exts: expectedExt,
        studies: expectedStudy,
    }
}

// in the case your sample data is different
export const expectedFacultyName = 'Dela Cruz, Juan';

export const expectedStatuses = ['Active', 'On Leave', 'Sabbatical'];

export const expectedRankPrefixes = [
    'Instructor',
    'Assistant Professor',
    'Associate Professor',
    'Professor',
];

//specific db instance for the tests.
//uses the same schema though since the schema has no runes.
//remember to clean up entries from this
import dotenv from 'dotenv';
import { and, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import * as schema from '../src/lib/server/db/schema';

dotenv.config({ path: '.env' });

export const testDB = drizzle(neon(process.env.DATABASE_URL!), { schema });

//warning: this gets checks for records also deleted
export function getData(): string[] {
    const res: string[] = [];

    for (const rec of seedData.testFaculty) res.push(`${rec.lastname}, ${rec.firstname}`);

    return res;
}


//general seed function
export async function seed() {
    // clear all tables
    await testDB.delete(schema.faculty);
    await testDB.delete(schema.facultyrank);
    await testDB.delete(schema.facultysemester);
    await testDB.delete(schema.facultyadminposition);

    await testDB.execute(sql`REFRESH MATERIALIZED VIEW account_search_view`);
    await testDB.execute(sql`REFRESH MATERIALIZED VIEW faculty_record_search_view`);

    // push faculty
    await testDB
        .insert(schema.faculty)
        .values(seedData.testFaculty);

    // push faculty ranks
    await testDB
        .insert(schema.facultyrank)
        .values(seedData.rankRelations);

    // push faculty semesters
    await testDB
        .insert(schema.facultysemester)
        .values(seedData.semesterRelations);

    // push faculty adminpositions
    await testDB
        .insert(schema.facultyadminposition)
        .values(seedData.adminRelations);


    // refresh views
    // TODO: restart serials
    await testDB.execute(sql`REFRESH MATERIALIZED VIEW account_search_view`);
    await testDB.execute(sql`REFRESH MATERIALIZED VIEW faculty_record_search_view`);

    /*
    for (const rec of testData) {
        // do not add duplicates
        // for simplicity's sake, just compare names
        const query = await testDB
            .select()
            .from(schema.faculty)
            .where(
                and(
                    eq(schema.faculty.lastname, rec.lastname),
                    eq(schema.faculty.firstname, rec.firstname),
                ),
            );
        if (query.length) continue;

        // i have NO idea why this has an error even though this works normally
        // probably a typescript thing
        // update: doesn't throw an error anymore for some reason
        await testDB.insert(schema.faculty).values({
            lastname: rec.lastname,
            middlename: rec.middlename,
            firstname: rec.firstname,
            suffix: rec.suffix,
            birthdate: new Date().toISOString(),
            status: rec.status,
            dateoforiginalappointment: new Date().toISOString(),
            psiitem: '',
            employeenumber: '',
            tin: '',
            gsis: '',
            philhealth: '',
            pagibig: '',
            remarks: '',
        });
    }
    */
}
