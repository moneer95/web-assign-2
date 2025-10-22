import { client } from './mongoDBClient.js'

await client.connect()
const db = client.db("WEB2");
  

export async function readDocs({collection, filter = {}, single = false}) {
    //get the collection
    const collectionData = db.collection(collection);
    if (single) {
        return await collectionData.findOne(filter);
    }
    else {
        return await collectionData.find(filter).toArray();
    }
}


export async function writeDocs({ collection, doc = {}, docs = [], single = false }) {
    //get the collection
    const collectionData = db.collection(collection);

    if (single) {
        return await collectionData.insertOne(doc);
    }
    else {
        return await collectionData.insertMany(docs);
    }
}

export async function updateDocs({collection, doc = {}, docs = [], single = false}) {
    //get the collection
    const collectionData = db.collection(collection);

    if (single) {
        return await collectionData.updateOne({ id: doc.id }, { $set: doc.$set });
    }
    else {
        return await collectionData.updateMany(docs);
    }

}


export async function deleteDocs({collection, filter = {}, single = false}) {
    //get the collection
    const collectionData = db.collection(collection);

    if (single) {
        return await collectionData.deleteOne(filter);
    }
    else {
        return await collectionData.deleteMany(filter);
    }

}
