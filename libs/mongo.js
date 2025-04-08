import { MongoClient } from "mongodb";

export async function initDbConnection() {
    if (!global._mongoDbClient) {
        let client = await MongoClient.connect(process.env.MONGO_URI);
        global._mongoDbClient = client
    }
}

export default async function fetchData(query) {
    if (!global._mongoDbClient) {
        await initDbConnection();
    }
    const cursor = global._mongoDbClient.db("LeagueWebsiteData").collection("divisions");
    return await cursor.find(query).toArray();
}