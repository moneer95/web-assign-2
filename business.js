const { updatePhoto, addTag, listPhotos, listAlbums, findPhoto, getUserByUserName } = require('./persistence')


/**
 * Try to log a user in with a username + password.
 * If the user doesn’t exist or the password doesn’t match, returns undefined.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<string|undefined>} the user’s id if valid, otherwise undefined
 */
async function login(username, password) {
    const u = await getUserByUserName(username);
    if (!u || u.password !== password) return undefined;
    return u.id; // userId
}


/**
 * Make sure the photo belongs to this user.
 * Throws an error if the photo is missing or owned by someone else.
 *
 * @param {object} photo - photo object with an `owner` field
 * @param {string|number} userId
 */
function ensureOwnerOrThrow(photo, userId) {
    if (!photo) throw new Error('PHOTO_NOT_FOUND');
    if (String(photo.owner) !== String(userId)) throw new Error('FORBIDDEN');
}


/**
 * Get one photo by id, check ownership, and add some extra info:
 * - a human-readable date
 * - album names instead of just ids
 *
 * Returns undefined if no photo was found.
 *
 * @param {string|number} userId
 * @param {string|number} id
 * @returns {Promise<object|undefined>} formatted photo or undefined
 */
async function formattedPhoto(userId, id) {
    let photo = await findPhoto(id)

    ensureOwnerOrThrow(photo, userId);
    if (!photo) {
        return
    }

    // add the formatted date
    photo['formattedDate'] = new Date(photo['date']).toLocaleDateString('en-us', {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    // get associated albums names
    photo['albumNames'] = await findAlbums(photo.albums)

    const { filename, title, formattedDate, albumNames, tags } = photo
    return { id, filename, title, formattedDate, albumNames, tags }

}


/**
 * Update title/description of a photo by id, only if owned by user.
 *
 * @param {string|number} userId
 * @param {string|number} id
 * @param {string} title
 * @param {string} description
 */
async function updatePhotoById(userId, id, title, description){
    let photo = await findPhoto(id)
    ensureOwnerOrThrow(photo, userId);

    return await updatePhoto(id, title, description)
}


/**
 * Get all photos that belong to the user, already formatted.
 *
 * @param {string|number} userId
 * @returns {Promise<object[]>}
 */
async function getMyPhotos(userId) {
    let photos = await listPhotos()

    let myPhotos = []
    for (let i = 0; i < photos.length; i++) {
        try {
            let photo = await formattedPhoto(userId, photos[i].id)
            myPhotos.push(photo)
        } catch(e) {
            continue
        }
    }
    return myPhotos
}


/**
 * Get all photos for this user that belong to a specific album name.
 * Album names are matched in lowercase.
 *
 * @param {string|number} userId
 * @param {string} albumName
 * @returns {Promise<object[]>}
 */
async function getAlbumPhotoList(userId, albumName) {
    let photos = await listPhotos()

    let albumPhotos = []
    for (let i = 0; i < photos.length; i++) {
        try {
            let photo = await formattedPhoto(userId, photos[i].id)
            if (photo.albumNames.includes(albumName.toLowerCase())) {
                albumPhotos.push(photo)
            }
        } catch(e) {
            continue
        }
    }
    return albumPhotos
}


/**
 * Given some album ids, return their names in lowercase.
 * If none match, returns an object with a “No Album…” message.
 *
 * @param {Array<string|number>} ids
 * @returns {Promise<string[]|object>}
 */
async function findAlbums(ids) {
    const albums = await listAlbums()

    let foundAlbums = []
    for (let i = 0; i < albums.length; i++) {
        if (ids.includes(albums[i].id)) {
            foundAlbums.push(albums[i].name.toLowerCase())
        }
    }

    if (foundAlbums.length) {
        return foundAlbums
    } else {
        return ({ 'name': 'No Album for this ID' })
    }
}


/**
 * Add a tag to a photo if it belongs to the user.
 *
 * @param {string|number} userId
 * @param {string|number} id
 * @param {string} tagName
 * @returns {Promise<boolean>} true if updated
 */
async function addTagById(userId, id, tagName){
    let photo = await findPhoto(id)
    ensureOwnerOrThrow(photo, userId);

    const isUpdated = await addTag(id, tagName)
    return isUpdated
}


module.exports = {
    login,
    formattedPhoto,
    getAlbumPhotoList,
    addTagById,
    updatePhotoById,
    getMyPhotos
}
