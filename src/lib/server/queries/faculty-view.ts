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

export async function getFacultyEducationalAttainments(facultyid: number) {
    return await db
        .select({
            degree: facultyeducationalattainment.degree,
            institution: facultyeducationalattainment.institution,
            graduationYear: facultyeducationalattainment.graduationyear,
        })
        .from(facultyeducationalattainment)
        .where(eq(facultyeducationalattainment.facultyid, facultyid));
}

export async function getFacultyFieldsOfInterest(facultyid: number) {
    return (
        await db
            .select({
                field: fieldofinterest.field,
            })
            .from(facultyfieldofinterest)
            .leftJoin(fieldofinterest, eq(fieldofinterest.fieldofinterestid, facultyfieldofinterest.fieldofinterestid))
            .where(eq(facultyfieldofinterest.facultyid, facultyid))
    ).map(({ field }) => field);
}

export async function getFacultyPromotionHistory(facultyid: number) {
    return await db
        .select({
            rankTitle: rank.ranktitle,
            appointmentStatus: facultyrank.appointmentstatus,
            dateOfTenureOrRenewal: facultyrank.dateoftenureorrenewal
        })
        .from(facultyrank)
        .leftJoin(rank, eq(rank.rankid, facultyrank.rankid))
        .where(eq(facultyrank.facultyid, facultyid));
}

export async function getFacultyHomeAddresses(facultyid: number) {
    return (
        await db
            .select({
                homeAddress: facultyhomeaddress.homeaddress,
            })
            .from(facultyhomeaddress)
            .where(eq(facultyhomeaddress.facultyid, facultyid))
    ).map(({ homeAddress }) => homeAddress);
}

export async function getFacultyEmailAddresses(facultyid: number) {
    return (
        await db
            .select({
                email: facultyemail.email,
            })
            .from(facultyemail)
            .where(eq(facultyemail.facultyid, facultyid))
    ).map(({ email }) => email);
}

export async function getFacultyProfile(facultyid: number) {
    // Personal Information
    const personalInfoArr = await db.select().from(faculty).where(eq(faculty.facultyid, facultyid));
    if (personalInfoArr.length === 0) return null;
    const [personalInfo] = personalInfoArr;

    // Related Information
    const relatedInfo = await Promise.all([
        getFacultyContactNumbers(facultyid), // Contact Numbers
        getFacultyEducationalAttainments(facultyid), // Educational Attainments
        getFacultyFieldsOfInterest(facultyid), // Fields of Interest
        getFacultyPromotionHistory(facultyid), // Promotion History
        getFacultyHomeAddresses(facultyid), // Home Addresses
        getFacultyEmailAddresses(facultyid), // Emails
    ]);

    return {
        ...personalInfo,
        contactNumbers: relatedInfo[0],
        educationalAttainments: relatedInfo[1],
        fieldsOfInterest: relatedInfo[2],
        promotionHistory: relatedInfo[3],
        homeAddresses: relatedInfo[4],
        emailAddresses: relatedInfo[5],
    };
}
