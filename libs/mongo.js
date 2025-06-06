import { MongoClient, ObjectId } from "mongodb";

export async function initDbConnection() {
    if (!global._mongoDbClient) {
        let client = await MongoClient.connect(process.env.MONGO_URI);
        global._mongoDbClient = client
    }
}

export function toObjectId(id) {
    if (id instanceof ObjectId) {
        return id;
    }
    if (ObjectId.isValid(id)) {
        return new ObjectId(id);
    }
    throw new Error(`Invalid ObjectId: ${id}`);
}

export default async function fetchData(query) {
    if (!global._mongoDbClient) {
        await initDbConnection();
    }
    const cursor = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");
    const data = await cursor.find(query).toArray();

    // Convert `_id` fields to strings
    return data.map(item => ({
        ...item,
        _id: item._id.toString(),
        seasons: item.seasons?.map(season => ({
            ...season,
            _id: season._id.toString(),
        })),
    }));
}