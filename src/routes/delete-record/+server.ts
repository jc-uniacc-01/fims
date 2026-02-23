import { deleteFacultyRecord } from '$lib/server/db-helpers';
import { json } from '@sveltejs/kit';

// TODO: secure with cookies
export async function POST({request, cookies}) {
    const data = await request.json();
    if (!data) return Response.error();
    if (!data.deleted) return Response.error();
    await deleteFacultyRecord(data.deleted);
    return json({success: true});;
}