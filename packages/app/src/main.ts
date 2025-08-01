import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Database } from 'data-model';

// ESM compatibility - equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow;
let database: Database;
let currentUser: any = null;

async function createWindow(): Promise<void> {
  // Initialize database with test path if provided
  const dbPath = process.env.TEST_DB_PATH;
  database = new Database(dbPath);
  await database.connect();

  // Create the browser window
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: !process.env.CI, // Don't show window in CI
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      offscreen: process.env.CI, // Use offscreen rendering in CI
    },
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    // In development, load from Vite dev server
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open the DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

// IPC handlers
ipcMain.handle('register-user', async (event, userData) => {
  try {
    const { name, email, password } = userData;
    const user = await database.createUser(name, email);
    return { success: true, user: user.toJSON() };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('login-user', async () => {
  try {
    const user = await database.getFirstUser();
    if (user) {
      currentUser = user;
      return { success: true, user: user.toJSON() };
    }
    return { success: false, error: 'No users found' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('get-current-user', async () => {
  return currentUser ? currentUser.toJSON() : null;
});

ipcMain.handle('logout', async () => {
  currentUser = null;
  return { success: true };
});

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', async () => {
  if (database) {
    await database.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});