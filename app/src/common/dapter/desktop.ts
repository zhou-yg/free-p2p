
export default class Desktop extends Adapter {
  getFileList() {
    return new Promise<IFile[]>(resolve => {

      resolve([]);
    });
  }
}
