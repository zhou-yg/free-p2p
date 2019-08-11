const { app, BrowserWindow } = require('electron')

function createWindow() {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.webContents.openDevTools()
  // 加载index.html文件
  win.loadFile('index.html')
}

app.on('ready', createWindow)
