// IMPORT
import { NextResponse } from 'next/server';

// ROUTE
export async function POST() {
    const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

    response.cookies.set('isAdmin', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}