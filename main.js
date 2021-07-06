const {app, BrowserWindow} = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('path')
const YOUR_ROOT_FOLDER = '1bibD4HDZVbqOPq882YSDTmZlI06fZvLU',
    PATH_TO_CREDENTIALS = path.resolve(`${__dirname}/my_credentials.json`);
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    ExampleOperations();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })

})
// Let's wrap everything in an async function to use await sugar
async function ExampleOperations() {
    const creds_service_user = require(PATH_TO_CREDENTIALS);

    const googleDriveInstance = new NodeGoogleDrive({
        ROOT_FOLDER: YOUR_ROOT_FOLDER
    });

    let gdrive = await googleDriveInstance.useServiceAccountAuth(
        creds_service_user
    );

    // List Folders under the root folder
    let folderResponse = await googleDriveInstance.listFolders(
        YOUR_ROOT_FOLDER,
        null,
        false
    );

    console.log({ folders: folderResponse.folders });

    // Create a folder under your root folder
    let newFolder = { name: 'folder_example' + Date.now() },
        createFolderResponse = await googleDriveInstance.createFolder(
            YOUR_ROOT_FOLDER,
            newFolder.name
        );

    newFolder.id = createFolderResponse.id;

    debug(`Created folder ${newFolder.name} with id ${newFolder.id}`);

    // List files under your root folder.
    let listFilesResponse = await googleDriveInstance.listFiles(
        YOUR_ROOT_FOLDER,
        null,
        false
    );

    for (let file of listFilesResponse.files) {
        debug({ file });
    }
}
