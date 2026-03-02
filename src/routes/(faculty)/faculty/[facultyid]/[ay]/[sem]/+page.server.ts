import { error } from '@sveltejs/kit';

import { getAllFacultySemesters, getAllSemesterms, getFacultySemestralRecords } from '$lib/server/queries/faculty-view';

export async function load({ params }) {
    const {
        facultyid: facultyidStr,
        ay: acadYearStr,
        sem: semNumStr,
    } = params;

    const facultyid = parseInt(facultyidStr, 10);
    const acadYear = parseInt(acadYearStr, 10);
    const semNum = parseInt(semNumStr, 10);

    // Validate parameters
    if (Number.isNaN(facultyid)) throw error(400, { message: 'Invalid record identifier.' });
    if (Number.isNaN(acadYear)) throw error(400, { message: 'Invalid academic year.' });
    if (Number.isNaN(semNum)) throw error(400, { message: 'Invalid semester.' });

    const semestralRecord = await getFacultySemestralRecords(facultyid, acadYear, semNum);

    // Validate output
    if (semestralRecord === null) throw error(400, { message: 'No semestral record found.' });

    // Get all possible semestral record options
    const existingOpts = await getAllFacultySemesters(facultyid);
    const allSemStrs = getAllSemesterms();

    // Get academic year options
    const acadYearOpts = [...new Set(existingOpts.map(({ acadYear }) => (acadYear)).filter((elem) => (elem !== null)))]
    if (!acadYearOpts.includes(acadYear)) throw error(400, { message: 'Invalid academic year.' });

    return {
        acadYear,
        acadYearOpts,
        allSemStrs,
        existingOpts,
        semestralRecord,
        semNum,
    };
}