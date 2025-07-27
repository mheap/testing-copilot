import { ipcMain, app, BrowserWindow } from "electron";
import * as path from "path";
import { Database } from "data-model";
let mainWindow;
let database;
let currentUser = null;
async function createWindow() {
  const dbPath = process.env.TEST_DB_PATH;
  database = new Database(dbPath);
  await database.connect();
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: !process.env.CI,
    // Don't show window in CI
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      offscreen: process.env.CI
      // Use offscreen rendering in CI
    }
  });
  mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}
ipcMain.handle("register-user", async (event, userData) => {
  try {
    const { name, email, password } = userData;
    const user = await database.createUser(name, email);
    return { success: true, user: user.toJSON() };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle("login-user", async () => {
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
ipcMain.handle("get-current-user", async () => {
  return currentUser ? currentUser.toJSON() : null;
});
ipcMain.handle("logout", async () => {
  currentUser = null;
  return { success: true };
});
app.whenReady().then(createWindow);
app.on("window-all-closed", async () => {
  if (database) {
    await database.close();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
