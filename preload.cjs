const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  imprimirPagina: () => ipcRenderer.send('imprimir-pagina'),
  imprimirRecibo: (dados) => ipcRenderer.send('imprimir-recibo', dados)
});

console.log('Preload executado: electronAPI exposto');
