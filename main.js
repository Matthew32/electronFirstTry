const {app, BrowserWindow} = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('path')
const YOUR_ROOT_FOLDER = '1bibD4HDZVbqOPq882YSDTmZlI06fZvLU',
    PATH_TO_CREDENTIALS = path.resolve(`${__dirname}/my_credentials.json`);
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

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
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })

})

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const TOKEN_PATH = 'AIzaSyCAuiyaZnYOzwWEtPX8tbSJP0L0s6HDPLo';


fs.readFile('my_credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    let jsonParsed = JSON.parse(content);
console.log(jsonParsed)
    authorize(jsonParsed, storeFiles);
});


function authorize(credentials, callback) {

    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err)
        {
            return getAccessToken(oAuth2Client, callback);

        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);

            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
            });
            callback(oAuth2Client);
        });
    });
}


function storeFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
        'name': 'ImageTest.jpeg'
    };
    var media = {
        mimeType: 'image/jpeg',
        //PATH OF THE FILE FROM YOUR COMPUTER
        body: fs.createReadStream('C:/Development/sync-files-drive/qwqwq.PNG')
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
        }
    });
}