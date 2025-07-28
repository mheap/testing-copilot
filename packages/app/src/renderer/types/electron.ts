// Electron API interface
declare global {
  interface Window {
    electronAPI: {
      registerUser: (userData: any) => Promise<{ success: boolean; user?: any; error?: string }>
      loginUser: () => Promise<{ success: boolean; user: any }>
      getCurrentUser: () => Promise<any>
      logout: () => Promise<void>
    }
  }
}

export {}