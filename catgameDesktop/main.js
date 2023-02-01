const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;

let mainWindow;

app.on("ready", function () {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);
});
