import { readDocs, writeDocs, updateDocs, deleteDocs } from "./persistance";


export async function getDocs(collection, filter = {}, single) {
    return await readDocs(collection, filter, single)
}

export async function insertDocs(collection, doc = {}, docs = [], single = false) {
    return await writeDocs(collection, doc, docs, single)
}

export async function editDocs(collection, filter = {}, single) {
    return await updateDocs(collection, filter, single)
}

export async function removeDocs(collection, filter = {}, single) {
    return await deleteDocs(collection, filter, single)
}