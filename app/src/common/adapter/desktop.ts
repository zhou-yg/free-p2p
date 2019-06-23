import Adapter from './index';
import {watch} from '../../rtc/receiver';
import { Events } from '../../rtc/events';

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

watch([
  [Events.GET_FILE_LIST, () => {
    console.log('receive getFileList')
  }]
])

window.dd = dd;
