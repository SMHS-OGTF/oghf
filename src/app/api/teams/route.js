import { initDbConnection, toObjectId } from "$/libs/mongo";

export async function POST(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, teamName } = await req.json();
    const newTeam = {
        id: teamName.toLowerCase().replace(/\s+/g, ''), // Generate a unique ID from the name
        displayName: teamName,
    };

    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $push: { "seasons.$.teams": newTeam } }
    );

    return new Response(JSON.stringify({ message: "Team created", team: newTeam }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

export async function PUT(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, teamId, updatedTeam } = await req.json();
    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId), "seasons.teams.id": teamId },
        { $set: { "seasons.$[season].teams.$[team]": updatedTeam } },
        { arrayFilters: [{ "season._id": toObjectId(seasonId) }, { "team.id": teamId }] }
    );

    return new Response(JSON.stringify({ message: "Team updated" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, teamId } = await req.json();
    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $pull: { "seasons.$.teams": { id: teamId } } }
    );

    return new Response(JSON.stringify({ message: "Team deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}