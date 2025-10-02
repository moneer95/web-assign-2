const prompt = require("prompt-sync")({ sigint: true });

const {
    login,
    formattedPhoto,
    getAlbumPhotoList,
    addTagById,
    updatePhotoById,
    getMyPhotos
} = require('./business');


/**
 * Prints the interactive console menu for the photo manager.
 * No return value.
 */
async function showMenu() {

    console.log("\n=== Photo Management Menu ===");
    console.log("1. Get My Photos");
    console.log("2. Find Photo");
    console.log("3. Update Photo Details");
    console.log("4. Album Photo List");
    console.log("5. Tag Photo");
    console.log("6. Exit");
}


/**
 * Runs the interactive loop:
 * - Shows the menu
 * - Reads the user's choice
 * - Performs the selected action until Exit is chosen
 * Handles async operations for each menu item.
 * No return value.
 */
async function runProgram() {

    console.log('Welcome! Please log in.');
    const username = prompt('Username: ');
    const password = prompt.hide('Password: ');
    const userId = await login(username, password);

    if (!userId) {
        console.log('Invalid credentials.');
        return;
    }
    console.log(`Hello, ${username}!`);


    let exit = false;


    while (!exit) {
        showMenu();
        let choice = prompt("Your selection> ");

        switch (choice) {

            case '1': {

                try{
                    const list = await getMyPhotos(userId);
                    console.log(list);
                }
                catch(e){
                    console.log("Can't Get Photo List", e);
                }
                break;
            }



            case '2': {

                const id = prompt('Enter Photo ID: ');
                try{
                    const photo = await formattedPhoto(userId, id);
                    console.log(photo)
                }
                catch(e){
                    console.log("Invalid Request", e);
                }

                break;
            }

            case '3': {
                const id = prompt('Enter Photo ID: ');
                const newTitle = prompt('Enter New Title (leave blank to keep): ');
                const newDescription = prompt('Enter New Description (leave blank to keep): ');
                try{
                    const ok = await updatePhotoById(userId, id, newTitle, newDescription);
                    console.log(ok ? 'Photo updated.' : 'Nothing changed (or not allowed).');
                }
                catch(e){
                    console.log("Can't Update", e);
                }

                break;
            }

            case '4': {
                const albumName = prompt('Enter Album Name: ');

                try{
                    const list = await getAlbumPhotoList(userId, albumName);
                    console.log(list);
                }
                catch(e){
                    console.log("Can't Get Album Photo List", e);
                }
                break;
            }

            case '5': {
                const id = prompt('Enter Photo ID: ');
                const newTag = prompt('Enter New Tag: ');

                try{
                    const ok = await addTagById(userId, id, newTag);
                    console.log(ok ? 'Tag added.' : 'Could not add tag (empty, not found, or not allowed).');
                }
                catch(e){
                    console.log("Can't Update", e);
                }
                break;
            }

            case "6":
                console.log("Exiting... Goodbye!");
                exit = true;

                break;
            default:
                console.log(" Invalid selection. Please enter 1–5.");
        }
    }


}


runProgram()