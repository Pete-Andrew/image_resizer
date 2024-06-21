const os = require('os');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const Toastify = require('toastify-js');
const { on } = require('events');

contextBridge.exposeInMainWorld('os', {  // can bring in node.js functions here and pass them into the renderer
    homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld('path', {  // can bring in node.js functions here and pass them into the renderer
    join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld('Toastify', {  // can bring in node.js functions here and pass them into the renderer
    toast: (options) => Toastify(options).showToast(),  //sets to a method called 'Toastify.toast',
});

contextBridge.exposeInMainWorld('ipcRenderer', {  // can bring in node.js functions here and pass them into the renderer
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func)=> ipcRenderer.on(channel, (event, ...args) => func(...args)),
});