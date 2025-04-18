// IMPORT
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// ROUTE
export async function POST(request) {
    const { password } = await request.json();

    const isValid = await bcrypt.compare(password + "b9ObBEdwJWYiqyaj", process.env.ADMIN_PASSWORD_HASH);

    if (!isValid) {
        return NextResponse.json({ message: 'Invalid' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Logged in' });

    response.cookies.set('isAdmin', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day expiration
    });

    return response;
}