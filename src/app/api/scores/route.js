import { initDbConnection, toObjectId } from "$/libs/mongo";

export async function POST(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId } = await req.json();
    const newScore = {
        team1: "",
        score1: 0,
        team2: "",
        score2: 0,
    };

    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $push: { "seasons.$.scores": newScore } }
    );

    return new Response(JSON.stringify({ message: "Score created", score: newScore }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

export async function PUT(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, scoreIndex, updatedScore } = await req.json();
    const updateQuery = {};
    Object.keys(updatedScore).forEach((key) => {
        updateQuery[`seasons.$.scores.${scoreIndex}.${key}`] = updatedScore[key];
    });

    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $set: updateQuery }
    );

    return new Response(JSON.stringify({ message: "Score updated" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, scoreIndex } = await req.json();
    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $unset: { [`seasons.$.scores.${scoreIndex}`]: 1 } }
    );
    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $pull: { "seasons.$.scores": null } }
    );

    return new Response(JSON.stringify({ message: "Score deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}