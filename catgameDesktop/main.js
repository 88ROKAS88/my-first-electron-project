const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on("ready", function () {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
  });
  mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);
});

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      { label: "New Game" },
      {
        label: "Exit",
        accelerator: "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle Developer Tools",
        accelerator: "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  },
];
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);
