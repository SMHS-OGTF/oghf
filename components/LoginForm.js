'use client';

// IMPORT
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// COMPONENT
export default function LoginForm() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            router.push('/admin');
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <form onSubmit={handleLogin} className="mx-auto flex flex-col gap-4 max-w-sm">
            <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-uiLight text-uiDark w-full px-4 py-2 rounded-md border-2 border-uiDark outline-none"
            />
            <button type="submit" className="btn bg-uiDark text-uiLight w-fit mx-auto px-12">Login</button>
            {error && <p className="text-lg text-center" style={{ color: "red" }}>{error}</p>}
        </form>
    );
}