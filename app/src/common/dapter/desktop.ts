import Adapter from './index';
import { IFile } from './index';

export default class Desktop extends Adapter {
  getFileList() {
    return new Promise<IFile[]>(resolve => {

      resolve([]);
    });
  }
}
