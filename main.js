const path = require('path');
const { app, BrowserWindow } = require('electron'); // brings in the app object and the browser window object

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'development'; //is the app currently got the dev console open? 

function createMainWindow () {
    const mainWindow = new BrowserWindow ({
        title: 'Image Resizer',
        width: isDev ? 1000: 500, //turnery statement to see if the dev tools are open and change the screen size accordingly
        height: 600,
    })

    // open the Dev tools if in dev environment
    if (isDev){
        mainWindow.webContents.openDevTools(); // opens the dev tools on NPM start
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html')); //finds the directory you are in and loads the html file from the renderer folder. 
}

//.whenReady returns a promise. When the app is ready it then calls the create window function
app.whenReady().then(()=> {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
      })
    
});  

app.on('window-all-closed', () => {
    if (!isMac) {
    app.quit () 
    }
})

console.log("hello world");

// npm start to get it going
// ctrl + C to end the console programme
// ctrl + shit + i opens up the dev tools in the open window, 

//to get this code running you'll need to do the following in your VS code terminal:
// npm init
// npm i electron resize-img toastify-js