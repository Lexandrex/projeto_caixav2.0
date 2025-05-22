const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    icon: __dirname + "/imagens/logo.png",
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // << aqui está o preload
        contextIsolation: true,
        nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'caixa.html'));

  // Captura o nome da impressora padrão
  let nomeImpressoraPadrao = null;
  mainWindow.webContents.getPrintersAsync().then(printers => {
    const padrao = printers.find(p => p.isDefault);
    if (padrao) {
      nomeImpressoraPadrao = padrao.name;
    }
  });

  // Escuta o evento para imprimir
  ipcMain.on('imprimir-pagina', () => {
    mainWindow.webContents.print({ silent: true, printBackground: true });
  });

  // Escuta o evento para imprimir recibo
  ipcMain.on('imprimir-recibo', (event, dados) => {
    if (!nomeImpressoraPadrao) {
      event.reply && event.reply('alerta', 'Impressora padrão ainda não carregada. Impressão cancelada.');
      return;
    }
    const reciboWin = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      },
      width: 350,
      height: 500
    });
    // Monta a URL com os dados do recibo
    const params = new URLSearchParams(dados).toString();
    const reciboPath = path.join(__dirname, 'recibo.html');
    reciboWin.loadFile(reciboPath, { search: params });
    reciboWin.webContents.on('did-finish-load', () => {
      // Usa mostrarAlerta no renderer via IPC
      event.reply && event.reply('alerta', `Imprimindo na impressora: ${nomeImpressoraPadrao}`);
      reciboWin.webContents.print({ silent: true, printBackground: true, deviceName: nomeImpressoraPadrao }, () => {
        reciboWin.close();
      });
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
