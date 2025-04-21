import { initDbConnection, toObjectId } from "$/libs/mongo";
import { ObjectId } from "mongodb";

export async function POST(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonName } = await req.json();
    const newSeason = {
        _id: new ObjectId(), // Generate a unique ID for the season
        seasonName,
        teams: [],
        rankings: [],
        scores: [],
        schedule: [],
    };

    await collection.updateOne(
        { _id: toObjectId(divisionId) },
        { $push: { seasons: newSeason } }
    );

    return new Response(JSON.stringify({ message: "Season created", seasonId: newSeason._id }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

export async function PUT(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, seasonName } = await req.json();
    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $set: { "seasons.$.seasonName": seasonName } }
    );

    return new Response(JSON.stringify({ message: "Season updated" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId } = await req.json();
    await collection.updateOne(
        { _id: toObjectId(divisionId) },
        { $pull: { seasons: { _id: toObjectId(seasonId) } } }
    );

    return new Response(JSON.stringify({ message: "Season deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}