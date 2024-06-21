const path = require('path');
const { app, BrowserWindow, Menu } = require('electron'); // brings in the app object and the browser window object

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'development'; //is the app currently got the dev console open? 

// create the main window
function createMainWindow () {
    const mainWindow = new BrowserWindow ({
        title: 'Image Resizer',
        width: isDev ? 1000: 500, //turnery statement to see if the dev tools are open and change the screen size accordingly
        height: 600,
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
    
    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html')); //finds the directory you are in and loads the html file from the renderer folder. 
}

// App is Ready
//.whenReady returns a promise. When the app is ready it then calls the create window function
app.whenReady().then(()=> {
    createMainWindow();

    //Implement Menu
    const mainMenu = Menu.buildFromTemplate(menu); //takes rhe Menu class and applies the 'buildFromTemplate' method on it, passes in the menu object below
    Menu.setApplicationMenu(mainMenu); // sets the menu for the app.

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
      })
});  


// menu template, this sets up the tool bar menus 
const menu = [
    ...(isMac ? [{   // ... is a spread operator, 
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

app.on('window-all-closed', () => { 
    if (!isMac) {
    app.quit () 
    }
})

console.log("hello world");

// npm start to get it going
// ctrl + C to end the console programme
// ctrl + shit + i opens up the dev tools in the open window,
// "npx electronmon ." typed into the terminal automatically re-starts the open window if you make a change in the code.    

//to get this code running you'll need to do the following in your VS code terminal:
// npm init
// npm i electron resize-img toastify-js

// tutorial link:
// https://www.youtube.com/watch?v=ML743nrkMHw&ab_channel=TraversyMedia