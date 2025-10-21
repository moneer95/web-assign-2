import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://mnyrskyk_db_user:stsa5n3aIaZtXN79@cluster0.lmvj56b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


