"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  registerUser: (userData) => electron.ipcRenderer.invoke("register-user", userData),
  loginUser: () => electron.ipcRenderer.invoke("login-user"),
  getCurrentUser: () => electron.ipcRenderer.invoke("get-current-user"),
  logout: () => electron.ipcRenderer.invoke("logout")
});
