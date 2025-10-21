import { client } from './mongoDBClient.js'

await client.connect()
const db = client.db("WEB2");


export async function readDocs(collection = "Lab7", filter = {}, single = false) {
    //get the collection
    const collectionData = db.collection(collection);

    if(single){
        return await collectionData.findOne(filter).toArray();
    }
    else{
        return await collectionData.find(filter).toArray();
    }
}


export async function writeDocs(collection = "Lab7", doc = {}, docs = [], single = false) {
    //get the collection
    const collectionData = db.collection(collection);

    if(single){
        return await collectionData.insertOne(doc);
    }
    else{
        return await collectionData.insertMany(docs);
    }

}

export async function updateDocs(collection = "Lab7", filter = {}, single = false) {
    //get the collection
    const collectionData = db.collection(collection);

    if(single){
        return await collectionData.updateOne(filter);
    }
    else{
        return await collectionData.updateMany(filter);
    }

}


export async function deleteDocs(collection = "Lab7", filter = {}, single = false) {
    //get the collection
    const collectionData = db.collection(collection);

    if(single){
        return await collectionData.deleteOne(filter);
    }
    else{
        return await collectionData.deleteMany(filter);
    }

}
