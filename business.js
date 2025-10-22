import { readDocs, writeDocs, updateDocs, deleteDocs } from "./persistance.js";


export async function getDocs({collection, filter, single = false}) {
    return await readDocs({collection, filter, single})
}

export async function insertDocs({ collection, doc, docs, single = false }) {
    return await writeDocs({ collection, doc, docs, single })
}

export async function editDocs({collection, doc, docs, single = false}) {
    return await updateDocs({collection, doc, docs, single})
}

export async function removeDocs({collection, filter, single = false}) {
    return await deleteDocs({collection, filter, single})
}