//The require() function is a built-in CommonJS module function supported in Node.js that lets you include modules within your project.
const path = require('path');
const os = require('os'); // operating system
const fs = require('fs'); //file system
const resizeImg = require('resize-img'); // resize-img is also a node module 
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron'); // brings in the app object and the browser window object

let mainWindow; //initialises mainWindow
let aboutWindow;

// comment this line in/out to start with/without the dev tools open in the programme
// process.env.NODE_ENV = 'production';

// check to see if the app is running on mac
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production'; //is the app currently got the dev console open? 

// create the main window
function createMainWindow () {
    mainWindow = new BrowserWindow ({
        title: 'Image Resizer',
        width: isDev ? 1000: 500, //turnery statement to see if the dev tools are open and change the screen size accordingly
        height: 600,

        webPreferences: {   //this allows node.js functionality to be used outside of the browser. 
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),   //
        }
    });

    // open the Dev tools if in dev environment
    if (isDev){
        mainWindow.webContents.openDevTools(); // opens the dev tools on NPM start
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html')); //finds the directory you are in and loads the html file from the renderer folder. 
}

// create the About window
function createAboutWindow(){
    const aboutWindow = new BrowserWindow ({
        title: 'About Image Resizer',
        width: 300, //turnery statement to see if the dev tools are open and change the screen size accordingly
        height: 300,
    });
    
// _dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file (node.js).
    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html')); //finds the directory you are in and loads the html file from the renderer folder. 
}

// App is Ready
//.whenReady returns a promise. When the app is ready it then calls the create window function
app.whenReady().then(()=> {
    createMainWindow();

    //Implement Menu
    const mainMenu = Menu.buildFromTemplate(menu); //takes rhe Menu class and applies the 'buildFromTemplate' method on it, passes in the menu object below
    Menu.setApplicationMenu(mainMenu); // sets the menu for the app.

    // Remove mainWindow from memory on close
    mainWindow.on('close', ()=> (mainWindow = null));

    //if there are no windows on 'activate' create the main window
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
      })
});  

// menu template, this sets up the tool bar menus depending on whether the app is on PC or Mac
// ... is a spread operator,  syntax allows an iterable, such as an array or string, to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected. Spread syntax can be used when all elements from an object or array need to be included in a new array or object.
const menu = [

    ...(isMac ? [{   
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
            }
        ]
    }] : []),
    
    {
        role: 'fileMenu',  // this line replaces the below code and does the same job.
        // label: 'file',
        // submenu: [
        //     {label: 'Quit',
        //     click: () => app.quit(), // exits the app
        //     accelerator: 'CmdOrCtrl+W'
        // }
        // ]
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [{
            label: 'About',
            click: createAboutWindow,
        }

        ]
    }] : []),
];

//Respond to ipcRenderer resize
ipcMain.on('image:resize', (e, options) => {
    options.dest = path.join(os.homedir(), 'imageresizer')
    console.log(options);
    resizeImage(options);
});

//Resize the image 
async function resizeImage({imgPath, width, height, dest}) {
    try {
        // console.log(imgPath, height, width, dest);
        const newPath = await resizeImg(fs.readFileSync(imgPath), {

            width: +width,   //Adding the + in front of these variables lets JavaScript know that they are numbers and not strings
            height: +height,
        });

// create filename
        const filename = path.basename(imgPath);
// create destination folder if it doesn't exist
 if(!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
 }

//  write file to destination folder
fs.writeFileSync(path.join(dest, filename), newPath);

// send Success to render
mainWindow.webContents.send('image:done');

// open destination folder
shell.openPath(dest);
    } catch (error) {
        console.log(error);
    }
}

// makes sure that the programme is stopped from running on a mac when closed
app.on('window-all-closed', () => { 
    if (!isMac) {
    app.quit () 
    }
});

//NOTES: 

//to get this code running you'll need to do the following in your VS code terminal:
// npm init
//the following line then brings in the necessary node.js libraries
// npm i electron resize-img toastify-js

//Then to run the code you'll need to do the following: 
// npm start to get it going
// OR "npx electronmon ." typed into the terminal automatically re-starts the open window if you make a change in the code.    
// ctrl + C to end the console programme
// ctrl + shit + i opens up the dev tools in the open window,

// tutorial link:
// https://www.youtube.com/watch?v=ML743nrkMHw&ab_channel=TraversyMedia
// link to the repo: 
// https://github.com/bradtraversy/image-resizer-electron