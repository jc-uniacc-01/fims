import { eq } from 'drizzle-orm';

import { db } from '../db';

import {
    faculty,
    facultycontactnumber,
    facultyeducationalattainment,
    facultyemail,
    facultyfieldofinterest,
    facultyhomeaddress,
    facultyrank,
    fieldofinterest,
    rank,
} from '../db/schema';

export async function getFacultyName(facultyid: number) {
    const response = await db
        .select({
            lastName: faculty.lastname,
            firstName: faculty.firstname,
        })
        .from(faculty)
        .where(eq(faculty.facultyid, facultyid));

    if (response.length === 0) return null;

    const [record] = response;
    return record;
}

export async function getFacultyContactNumbers(facultyid: number) {
    return (
        await db
            .select({
                contactnumber: facultycontactnumber.contactnumber,
            })
            .from(facultycontactnumber)
            .where(eq(facultycontactnumber.facultyid, facultyid))
    ).map(({ contactnumber }) => contactnumber);
}

export async function getFacultyProfile(facultyid: number) {
    const response = await db.select().from(faculty).where(eq(faculty.facultyid, facultyid));
    if (response.length === 0) return null;
    const [record] = response;

    // Contact Numbers
    const contactNumbers = getFacultyContactNumbers(facultyid);

    // Educational Attainments
    const educationalAttainments = await db
        .select({
            degree: facultyeducationalattainment.degree,
            institution: facultyeducationalattainment.institution,
            graduationYear: facultyeducationalattainment.graduationyear,
        })
        .from(facultyeducationalattainment)
        .where(eq(facultyeducationalattainment.facultyid, facultyid));

    // Fields of Interest
    const fieldsOfInterest = (
        await db
            .select({
                field: fieldofinterest.field,
            })
            .from(facultyfieldofinterest)
            .leftJoin(fieldofinterest, eq(fieldofinterest.fieldofinterestid, facultyfieldofinterest.fieldofinterestid))
            .where(eq(facultyfieldofinterest.facultyid, facultyid))
    ).map(({ field }) => field);

    // Promotion History
    const promotionHistory = await db
        .select({
            rankTitle: rank.ranktitle,
            appointmentStatus: facultyrank.appointmentstatus,
            dateOfTenureOrRenewal: facultyrank.dateoftenureorrenewal
        })
        .from(facultyrank)
        .leftJoin(rank, eq(rank.rankid, facultyrank.rankid))
        .where(eq(facultyrank.facultyid, facultyid));

    // Home Addresses
    const homeAddresses = (
        await db
            .select({
                homeAddress: facultyhomeaddress.homeaddress,
            })
            .from(facultyhomeaddress)
            .where(eq(facultyhomeaddress.facultyid, facultyid))
    ).map(({ homeAddress }) => homeAddress);

    // Emails
    const emails = (
        await db
            .select({
                email: facultyemail.email,
            })
            .from(facultyemail)
            .where(eq(facultyemail.facultyid, facultyid))
    ).map(({ email }) => email);

    return {
        ...record,
        contactNumbers,
        educationalAttainments,
        fieldsOfInterest,
        promotionHistory,
        homeAddresses,
        emails,
    };
}
