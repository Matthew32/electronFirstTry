const dialog = require('electron').remote.dialog
// include the Node.js 'path' module at the top of your file
const {client_id, redirect_uris, client_secret, access_token, refresh_token} = require("./my_credentials.json");
const path = require('path')

const fs = require('fs');
const {google} = require('googleapis');
const googleAuth = require('google-auth-library');
const drive = google.drive('v3');
const uploadFile = document.getElementById('upload');
const uploadPath = document.getElementById('upload-path')
let fileBuffer = null
global.filepath = undefined;
uploadFile.addEventListener('click', () => {
    console.log(uploadPath.value)
    uploadFileCallback(uploadPath.value)
});
uploadPath.addEventListener('click', () => {
// If the platform is 'win32' or 'Linux'
    if (process.platform !== 'darwin') {
        // Resolves to a Promise<Object>
        dialog.showOpenDialog({
            title: 'Select the File to be uploaded',
            defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: 'Upload',
            // Restricting the user to only Text Files.
            filters: [
                {
                    name: 'File',
                    extensions: ['txt', 'docx', 'jpg', 'gif', 'png']
                },],
            // Specifying the File Selector Property
            properties: ['openFile']
        }).then(file => {
            // Stating whether dialog operation was
            // cancelled or not.
            if (!file.canceled) {
                setFilePath(file.filePaths[0].toString() ?? null)
            }
        }).catch(err => {
            console.log(err)
        });
    } else {
        // If the platform is 'darwin' (macOS)
        dialog.showOpenDialog({
            title: 'Select the File to be uploaded',
            defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: 'Upload',
            filters: [
                {
                    name: 'File',
                    extensions: ['txt', 'docx', 'jpg', 'gif', 'png']
                },],
            // Specifying the File Selector and Directory
            // Selector Property In macOS
            properties: ['openFile', 'openDirectory']
        }).then(file => {
            if (!file.canceled) {
                setFilePath(file.filePaths[0].toString() ?? null)
            }
        }).catch(err => {
            console.log(err)
        });
    }
});

async function setFilePath(filePath) {
    uploadPath.value = filePath;
}

function uploadFileCallback(filePath) {
    uploadFileToGoogle(filePath).then(function () {

    });
}

function setUploadFunctionality() {

}

async function uploadFileToGoogle(file) {
    const auth = new google.auth.OAuth2({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uris[0]
    });
    auth.setCredentials({access_token: access_token, refresh_token: refresh_token});
    var drive = google.drive({version: 'v3', auth: auth});
    var name = file.split('\\')
    var fileMetadata = {
        'name': 'photo.jpg',
        'mimeType': 'image/jpg',
    };

    var media = {
        mimeType: 'image/jpg',
        body: fs.createReadStream(path.normalize(uploadPath.value))
    };


    await drive.files.create({
        auth: auth,
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            return false;
        } else {
            console.log(err)
            console.log('File Id: ', file);
        }
    });
    return true;
}