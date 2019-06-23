import Adapter from './index';

export default class Desktop extends Adapter {
  constructor () {
    super('desktop');
  }
  getFileList() {
    return new Promise<IFile[]>(resolve => {

      resolve([]);
    });
  }
}

const dd = new Desktop();

window.dd = dd;
