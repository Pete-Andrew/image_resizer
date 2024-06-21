const os = require('os');
const path = require('path');
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('os', {  // can bring in node.js functions here and pass them into the renderer
    homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld('path', {  // can bring in node.js functions here and pass them into the renderer
    join: (...args) => path.join(...args),
});