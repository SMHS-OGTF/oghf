import { initDbConnection } from "$/libs/mongo";
import { ObjectId } from "mongodb";

export async function POST(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { divisionName } = await req.json();
    const result = await collection.insertOne({ divisionName, seasons: [] });

    return new Response(JSON.stringify({ message: "Division created", id: result.insertedId }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

export async function PUT(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { id, divisionName } = await req.json();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { divisionName } });

    return new Response(JSON.stringify({ message: "Division updated" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(req) {
    await initDbConnection();
    const collection = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");

    const { id } = await req.json();
    await collection.deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ message: "Division deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}