interface IFile {
  id: string;
  name: string;
  path: string;
}

export default abstract class Adapter {
  constructor () {
  }

  public abstract getFileList(): IFile[];
}