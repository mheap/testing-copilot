"use strict";
const electron = require("electron");
const path = require("path");
const dataModel = require("data-model");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
let mainWindow;
let database;
let currentUser = null;
async function createWindow() {
  database = new dataModel.Database();
  await database.connect();
  mainWindow = new electron.BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path__namespace.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadFile(path__namespace.join(__dirname, "..", "dist", "index.html"));
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}
electron.ipcMain.handle("login-user", async () => {
  try {
    const user = await database.getFirstUser();
    if (user) {
      currentUser = user;
      return { success: true, user: user.toJSON() };
    }
    return { success: false, error: "No users found" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
});
electron.ipcMain.handle("get-current-user", async () => {
  return currentUser ? currentUser.toJSON() : null;
});
electron.ipcMain.handle("logout", async () => {
  currentUser = null;
  return { success: true };
});
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", async () => {
  if (database) {
    await database.close();
  }
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
