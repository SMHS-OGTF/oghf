// IMPORT
import fetchData from "$/libs/mongo";
import Link from "next/link";
import AdminDashboard from "#/AdminDashboard";
import LoginForm from "#/LoginForm";
import { cookies } from "next/headers";

// PAGE
export default async function Admin() {
    const browserCookies = await cookies()
    const isAdmin = browserCookies.get('isAdmin')?.value === 'true';

    if (!isAdmin) {
        return <>
            {/* TITLE */}
            <h1 className="text-3xl text-uiDark font-bold text-center">Log In</h1>
            <Link href="/" className="text-lg text-uiDark mb-6 block underline text-center">Back to Dashboard</Link>
            <LoginForm />
        </>
    }

    let rawDivisions = await fetchData({})

    const divisions = rawDivisions.map(({ _id, divisionName, seasons }) => ({
        _id: _id.toString(),
        divisionName,
        seasons: seasons.map(season => ({
            _id: season._id.toString(), // Use the ObjectId from the database
            seasonName: season.seasonName,
            teams: season.teams || [],
            scores: season.scores || [],
            schedule: season.schedule || [],
        })),
    }));

    return <>
        {/* TITLE */}
        <h1 className="text-3xl text-uiDark font-bold">Admin Panel</h1>
        <Link href="/" className="text-lg text-uiDark mb-6 underline">Back to Dashboard</Link>

        <form action="/api/logout" method="POST" className="inline ml-6">
            <button type="submit" className="text-lg text-uiDark mb-6 underline">Logout</button>
        </form>

        {/* ADMIN DASHBOARD */}
        <AdminDashboard divisions={divisions}/>
    </>
}