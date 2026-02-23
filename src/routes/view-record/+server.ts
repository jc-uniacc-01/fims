import { json, redirect } from '@sveltejs/kit'

export const POST = async ({request, cookies}) => {
    const data:{requested:number} = await request.json();
    cookies.set('viewed-record', `${data.requested}`, {path: '/'}); 

    redirect(302, '/record');
}