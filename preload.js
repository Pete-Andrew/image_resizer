// can bring in node.js functions here and pass them into the renderer
const os = require('os');
const path = require('path');
// contextbidge is "a safe, bi-directional, synchronous bridge across isolated contexts"
// Communicates asynchronously from a renderer process to the main process.
const { contextBridge, ipcRenderer } = require('electron');
const Toastify = require('toastify-js');
const { on } = require('events');

contextBridge.exposeInMainWorld('os', { 
    //Returns the string path of the current user's home directory.
    homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld('path', {  
    join: (...args) => path.join(...args),
});

//React-Toastify allows you to add notifications to your app with ease. 
contextBridge.exposeInMainWorld('Toastify', {  
    toast: (options) => Toastify(options).showToast(),  //sets to a method called 'Toastify.toast',
});

// The ipcRenderer module is an EventEmitter. It provides a few methods so you can send synchronous and asynchronous messages from the render process (web page) to the main process.
contextBridge.exposeInMainWorld('ipcRenderer', {  
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func)=> ipcRenderer.on(channel, (event, ...args) => func(...args)),
});