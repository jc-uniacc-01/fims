import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
    if (!locals.user && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/api/auth'))
        throw redirect(307, '/login');

    return { user: locals.user };
}
