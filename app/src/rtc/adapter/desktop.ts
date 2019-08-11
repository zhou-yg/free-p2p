import Adapter from './index';
import {watch} from '../receiver';
import { Events } from '../../common/events';
import {desktop} from '../../common/native'

class Desktop extends Adapter {
  constructor () {
    super('desktop');
  }
  public fetch(e:string, d:any): Promise<any> {
    return desktop[e](d);
  }
}

const dd = new Desktop();

let watchEvents:any = Object.keys(Events).map(k => {
  k = Events[k];
  return [
    k,
    async (data: any, send: any) => {
      console.log('receive getFileList')

      let files = await dd.fetch(k, data);

      send(files);
    },
  ];
});

watch(watchEvents);

window.presetApi = () => dd;
