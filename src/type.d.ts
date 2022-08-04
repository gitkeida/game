interface IElectronAPI {
  setTitle: (title) => void,
  openFile: () => {},
  onHandleCounter: (callback) => {},
  createWindow: (type, params?: any) => {},
  setStore: (type: string, params: Array<any>) => void,
  getStore: (type) => []
}


declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

// React中需要加上这个才能被引用
export {}