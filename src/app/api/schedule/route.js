import { initDbConnection, toObjectId } from "$/libs/mongo";

export async function POST(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId } = await req.json();
    const newSchedule = {
        homeTeam: "",
        awayTeam: "",
        date: "",
        time: "",
    };

    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $push: { "seasons.$.schedule": newSchedule } }
    );

    return new Response(JSON.stringify({ message: "Schedule entry created", schedule: newSchedule }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

export async function PUT(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, scheduleIndex, updatedSchedule } = await req.json();
    const updateQuery = {};
    Object.keys(updatedSchedule).forEach((key) => {
        updateQuery[`seasons.$.schedule.${scheduleIndex}.${key}`] = updatedSchedule[key];
    });

    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $set: updateQuery }
    );

    return new Response(JSON.stringify({ message: "Schedule updated" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionId, seasonId, scheduleIndex } = await req.json();
    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $unset: { [`seasons.$.schedule.${scheduleIndex}`]: 1 } }
    );
    await collection.updateOne(
        { _id: toObjectId(divisionId), "seasons._id": toObjectId(seasonId) },
        { $pull: { "seasons.$.schedule": null } }
    );

    return new Response(JSON.stringify({ message: "Schedule entry deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}