 
import { updatePhoto, addTag, listPhotos, listAlbums, findPhoto, readFile, listAlbums} from './persistence'


/**
 * Builds a formatted view of a single photo by ID.
 * Looks up the raw photo, adds a human-readable date, and resolves album IDs to names.
 * Returns an object with id, filename, title, formattedDate, albumNames, and tags.
 * Returns undefined if no photo is found for the given id.
 * @param id Photo ID to format.
 * @returns A formatted photo object or undefined.
 */
async function formattedPhoto(id) {
    let photo = await findPhoto(id)

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
 * Returns a list of formatted photos that belong to the given album name.
 * Matching is currently case-sensitive because it uses a direct includes check.
 * @param albumName The album name to filter by.
 * @returns An array of formatted photos in that album.
 */
async function getAlbumPhotoList(albumName) {
    let photos = await listPhotos()

    let albumPhotos = []
    for (let i = 0; i < photos.length; i++) {

        let photo = await formattedPhoto(photos[i].id)
        if (photo.albumNames.includes(albumName)) {
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

module.exports = {
    formattedPhoto,
    getAlbumPhotoList,
    findAlbums
}