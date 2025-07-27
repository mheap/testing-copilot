import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  registerUser: (userData) => ipcRenderer.invoke("register-user", userData),
  loginUser: () => ipcRenderer.invoke("login-user"),
  getCurrentUser: () => ipcRenderer.invoke("get-current-user"),
  logout: () => ipcRenderer.invoke("logout")
});
