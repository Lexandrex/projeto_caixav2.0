const { app, BrowserWindow } = require('electron');
const path = require('path');


let mainWindow;

//assim que nossa aplicação estiver pronta ela ira executar a função 
app.on('ready', () => {
    // abrir uma nova tela do windows
    mainWindow = new BrowserWindow({
        fullscreen: true,
        // mudar o icone para um melhor 
        icon: __dirname + "/imagens/logo.png"
    });
    mainWindow.loadFile(path.join(__dirname, 'caixa.html'));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

});