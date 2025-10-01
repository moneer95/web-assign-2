const prompt = require("prompt-sync")({ sigint: true });



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