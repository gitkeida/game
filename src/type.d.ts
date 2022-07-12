interface IElectronAPI {
  setTitle: (title) => void,
  openFile: () => {},
  onHandleCounter: (callback) => {},
}


declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

// React中需要加上这个才能被引用
export {}