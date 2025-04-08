// IMPORT
import fetchData from "$/libs/mongo";
import Link from "next/link";
import CardSelector from "./CardSelector";

// PAGE
export default async function Admin() {
    let rawDivisions = await fetchData({})

    const divisions = rawDivisions.map(({ _id, divisionName, seasons }) => ({
        _id: _id.toString(),
        divisionName,
        seasons,
    }));

    return <>
        {/* TITLE */}
        <h1 className="text-3xl text-uiDark font-bold">Admin Panel</h1>
        <Link href="/" className="text-lg text-uiDark mb-6 block underline">Back to Dashboard</Link>

        {/* DIVISON MENU */}
        <h3 className="mb-2 text-xl text-uiDark border-uiDark border-b-2">Divisions</h3>
        <CardSelector cards={divisions} cardProperty="divisionName" />

        {/* SEASON MENU */}
        <h3 className="mb-2 text-xl text-uiDark border-uiDark border-b-2">Seasons</h3>
        <CardSelector cards={divisions} cardProperty="..." />
    </>
}