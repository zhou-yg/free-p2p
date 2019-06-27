interface IFile {
  id: string,
  name: string,
  path: string,
}
interface IFileData extends IFile {
  data: number;
}
declare abstract class Adapter {
  public env: string;
  public abstract fetch<T>(e: string, d?: any): Promise<T>;
}

declare module '*.css';
declare module "*.png";

interface Window {
  REGISTER_ENV: {};
  Adapter: string;
  presetApi: (e?: any) => Adapter;
}
