export default abstract class Adapter {
  public env:string;

  constructor(e:string) {
    this.env = e;
  }
  public abstract getFileList(): Promise<IFile[]>;
}
