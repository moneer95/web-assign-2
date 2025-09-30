const prompt = require("prompt-sync")({ sigint: true });
const fs = require('fs/promises')


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
    let photos = await readFile('photos.json')

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
    const albums = await readFile('albums.json')

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






/**
 * Prints the interactive console menu for the photo manager.
 * No return value.
 */
function showMenu() {

    console.log("\n=== Photo Management Menu ===");
    console.log("1. Find Photo");
    console.log("2. Update Photo Details");
    console.log("3. Album Photo List");
    console.log("4. Tag Photo");
    console.log("5. Exit");
}




let exit = false;
/**
 * Runs the interactive loop:
 * - Shows the menu
 * - Reads the user's choice
 * - Performs the selected action until Exit is chosen
 * Handles async operations for each menu item.
 * No return value.
 */
async function runProgram() {


    while (!exit) {
        showMenu();
        let choice = prompt("Your selection> ");

        switch (choice) {
            case "1": {

                const id = prompt("Enter Photo ID: ")
                const photo = await formattedPhoto(id)
                console.log(photo)

                break;
            }

            case "2": {

                const id = prompt("Enter Photo ID: ")
                await updatePhoto(id)

                break;
            }
            case "3": {

                const albumName = prompt("Enter Album Name: ").toLowerCase()
                const albumPhotoList = await getAlbumPhotoList(albumName)
                console.log(albumPhotoList)

                break;

            }
            case "4": {

                const id = prompt("Enter Photo ID: ")
                await addTag(id)

                break;

            }
            case "5":
                console.log("Exiting... Goodbye!");
                exit = true;

                break;
            default:
                console.log(" Invalid selection. Please enter 1–5.");
        }
    }


}


runProgram()