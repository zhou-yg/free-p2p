interface IFile {
  id: string;
  name: string;
  path: string;
}

declare abstract class Adapter {

  public abstract getFileList(): Promise<IFile[]>;
}

declare module '*.css';
declare module "*.png";

interface Window {
  REGISTER_ENV: {};
  Adapter: string;
  bb: Adapter;
  dd: Adapter;
}