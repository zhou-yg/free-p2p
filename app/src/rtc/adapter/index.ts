export default abstract class Adapter {
  public env:string;

  constructor(e:string) {
    this.env = e;
  }

  public abstract fetch<T> (e: string, d: any): Promise<T>;
}
