const fs = require('fs/promises')

/**
 * Update a photo’s title and description by its id.
 * Keeps old values if the new ones are empty.
 * Writes changes back to disk.
 *
 * @param {string|number} id - photo id
 * @param {string} title - new title (optional)
 * @param {string} description - new description (optional)
 * @returns {Promise<boolean>} true if updated, false if not found
 */
async function updatePhoto(id, title, description) {
    let photos = await listPhotos()
    let newPhoto = await findPhoto(id)

    if (!newPhoto) {
        return false
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

    return true
}


/**
 * Add a tag to a photo by id.
 * Saves the updated list to disk.
 *
 * @param {string|number} id - photo id
 * @param {string} tagName - tag to add
 * @returns {Promise<boolean>} true if tag added, false if not found
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
 * Look up a photo by id (raw, unformatted).
 *
 * @param {string|number} id - photo id
 * @returns {Promise<object|undefined>} the photo or undefined if not found
 */
async function findPhoto(id) {
    const photos = await listPhotos()

    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id == id) {
            return photos[i]
        }
    }
}


/**
 * Read all photos from photos.json.
 *
 * @returns {Promise<object[]>} array of photo objects
 */
async function listPhotos() {
    const photos = await readFile('photos.json')
    return photos
}


/**
 * Read all albums from albums.json.
 *
 * @returns {Promise<object[]>} array of album objects
 */
async function listAlbums() {
    const photos = await readFile('albums.json')
    return photos
}


/**
 * Get a user object by username from passwords.json.
 * Returns undefined if not found.
 *
 * @param {string} userName
 * @returns {Promise<object|undefined>} user object
 */
async function getUserByUserName(userName) {
    const users = await readFile('passwords.json')

    return users.find(user => user.username == userName)
}


/**
 * Read and parse a JSON file.
 *
 * @param {string} fileName - path to JSON file
 * @returns {Promise<any>} parsed content
 */
async function readFile(fileName) {
    const jsonContent = await fs.readFile(fileName, 'utf8')
    const content = JSON.parse(jsonContent)

    return content
}


/**
 * Save data into photos.json (pretty-printed).
 *
 * @param {any} data - data to save
 */
async function writeFile(data) {
    const jsonContent = JSON.stringify(data, null, 2)
    await fs.writeFile('photos.json', jsonContent)
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
