//import { getFacultyRecordList } from '$lib/server/db-helpers';

export async function load() {
    //const facultyRecordList = await getFacultyRecordList();
    const facultyRecordList = [
        {
            facultyid: 1,
            lastname: 'Dela Cruz',
            firstname: 'Juan',
            status: 'Active',
            ranktitle: 'Professor 7',
            adminposition: 'Department Chair',
            logTimestamp: new Date(),
            logMaker: 'it@up.edu.ph',
            logOperation: 'Made record.',
        },
        {
            facultyid: 2,
            lastname: 'Reyes',
            firstname: 'Sara',
            status: 'Active',
            ranktitle: 'Assistant Professor 1',
            adminposition: null,
            logTimestamp: new Date(),
            logMaker: 'it@up.edu.ph',
            logOperation: 'Made record.',
        },
        {
            facultyid: 3,
            lastname: 'Morales',
            firstname: 'Leonora',
            status: 'Active',
            ranktitle: 'Instructor 1',
            adminposition: null,
            logTimestamp: new Date(),
            logMaker: 'it@up.edu.ph',
            logOperation: 'Made record.',
        },
    ];

    return { facultyRecordList };
}
