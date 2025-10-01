
/**
 * Updates a photo's title and description by ID.
 * Prompts the user for new values (keeps old values if inputs are empty),
 * then writes the updated photos list back to disk.
 * Does nothing if the photo is not found.
 * @param id Photo ID to update.
 * @returns Nothing.
 */
async function updatePhoto(id, title, description) {
    let photos = await listPhotos()
    let newPhoto = await findPhoto(id)

    if (!newPhoto) {
        return
    }

    const newTitle = title
    const newDescription = description

    newPhoto.title = newTitle ? newTitle : newPhoto.title
    newPhoto.description = newDescription ? newDescription : newPhoto.description

    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id == newPhoto.id) {
            photos[i] = newPhoto
        }
    }

    await writeFile(photos)

}











/**
 * Adds a single tag to a photo by ID and saves the change.
 * If the photo is not found, no changes are made.
 * @param id Photo ID to tag.
 * @returns true if updated and false if not updated.
 */
async function addTag(id, tagName) {
    let photos = await listPhotos()
    let photo = await findPhoto(id)

    if (!photo) {
        return false
    }

    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id == photo.id) {
            photos[i].tags.push(tagName)
        }
    }

    await writeFile(photos)

    return true

}






/**
 * Finds and returns a raw photo object (unformatted) by ID.
 * Logs a message and returns undefined if not found.
 * @param id Photo ID to search for.
 * @returns The matching raw photo or undefined.
 */
async function findPhoto(id) {
    const photos = await listPhotos()

    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id == id) {
            return photos[i]
        }
    }

    //notify if not found
    console.log('no photo found with this id')
}



/**
 * Returns a list of all Photos inside photos.json file.
 * Throws if the file cannot be read or the contents are not valid JSON.
 * @returns array of Objects Photos.
 */
async function listPhotos() {
    const photos = await readFile('photos.json')
    return photos
}


/**
 * Returns a list of all Albums inside albums.json file.
 * Throws if the file cannot be read or the contents are not valid JSON.
 * @returns array of Objects Albums.
 */
async function listAlbums() {
    const photos = await readFile('albums.json')
    return photos
}



/**
 * Get a specific user object from  users file
 * return undefined if the user was not in file
 * @param userName userName you are looking for.
 * @returns user object.
 */
function getUserByUserName(userName) {
    const users = readFile('passwords.json')

    return users.find(user => user.username == userName)
}



/**
 * Reads a JSON file from disk and parses it.
 * Throws if the file cannot be read or the contents are not valid JSON.
 * @param fileName Path to the JSON file.
 * @returns The parsed JSON content.
 */
async function readFile(fileName) {
    const jsonContent = await fs.readFile(fileName, 'utf8')
    const content = JSON.parse(jsonContent)

    return content
}


/**
 * Serializes data as pretty JSON and writes it to photos.json.
 * Overwrites the file and logs a confirmation on success.
 * @param data Any serializable data structure to persist.
 * @returns Nothing.
 */
async function writeFile(data) {
    const jsonContent = JSON.stringify(data, null, 2)
    await fs.writeFile('photos.json', jsonContent)
    console.log('file updated')

}





module.exports = {
    updatePhoto,
    addTag,
    findPhoto,
    listPhotos,
    listAlbums,
    getUserByUserName,
    readFile,
    writeFile
}