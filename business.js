
import { updatePhoto, addTag, listPhotos, listAlbums, findPhoto, readFile, listAlbums } from './persistence'



/**
 * Check if the user has valid login details.
 * Returns undefined if no user is found for the given username.
 * @param userName user name.
 * @returns user id.
 */
async function login(username, password) {
    const u = await getUserByUsername(username);
    if (!u || u.password !== password) return undefined;
    return u.id; // userId
}



/**
 * Check if the user is the owner of this photo.
 * Throw an Error if the user is not the owner.
 * @param {photo, userId} user name.
 * @returns user id.
*/
function ensureOwnerOrThrow(photo, userId) {
    if (!photo) throw new Error('PHOTO_NOT_FOUND');
    if (String(photo.owner) !== String(userId)) throw new Error('FORBIDDEN');
}



/**
 * Builds a formatted view of a single photo by ID.
 * Looks up the raw photo, adds a human-readable date, and resolves album IDs to names.
 * Returns an object with id, filename, title, formattedDate, albumNames, and tags.
 * Returns undefined if no photo is found for the given id.
 * @param id Photo ID to format.
 * @returns A formatted photo object or undefined.
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



async function updatePhotoById(userId, id, title, description){
    let photo = await findPhoto(id)
    ensureOwnerOrThrow(photo, userId);

    
    return await updatePhoto(id, title, description)
}



/**
 * Returns a list of formatted photos that belong to the given album name.
 * Matching is currently case-sensitive because it uses a direct includes check.
 * @param albumName The album name to filter by.
 * @returns An array of formatted photos in that album.
 */
async function getAlbumPhotoList(userId, albumName) {
    let photos = await listPhotos()


    let albumPhotos = []
    for (let i = 0; i < photos.length; i++) {

        let photo = await formattedPhoto(photos[i].id)
        if (photo.albumNames.includes(albumName)) {
            ensureOwnerOrThrow(photo, userId);
            albumPhotos.push(photo)
        }
    }

    return albumPhotos

}




/**
 * Resolves an array of album IDs to their names (lowercased).
 * If none are found, returns an object like { name: 'No Album for this ID' }.
 * Consider normalizing this to always return an array for easier downstream use.
 * @param ids List of album IDs to resolve.
 * @returns An array of album names, or an object indicating none found.
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
    }
    else {
        return ({ 'name': 'No Album for this ID' })
    }
}


async function addTagById(userId, tagId, tagName){
    let photo = await findPhoto(id)
    ensureOwnerOrThrow(photo, userId);

    const isUpdated = await addTag(tagId, tagName)
    return isUpdated
}


module.exports = {
    login,
    formattedPhoto,
    getAlbumPhotoList,
    addTagById,
    updatePhotoById
}