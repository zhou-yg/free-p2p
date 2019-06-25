import Adapter from './index';
import {watch} from '../../rtc/receiver';
import { Events } from '../../rtc/events';

export default class Desktop extends Adapter {
  constructor () {
    super('desktop');
  }
  getFileList() {
    return new Promise<IFile[]>(resolve => {

      resolve([
        {
          id: '2',
          name: '测试',
          path: 'txt',
        },
      ]);
    });
  }
}

const dd = new Desktop();

watch([
  [Events.GET_FILE_LIST, async (send) => {
    console.log('receive getFileList')

    let files = await dd.getFileList();

    console.log(files);

    send(files);
  }]
])

window.dd = dd;
