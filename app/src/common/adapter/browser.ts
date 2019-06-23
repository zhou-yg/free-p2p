import { send, subscribe } from '../../rtc/sender';
import { Events } from '../../rtc/events';
import { resolve } from 'path';
import Adapter from './index';

export default class Browser extends Adapter {
  constructor () {
    super('browser')
  }
  getFileList () {

    console.log('send event:', Events.GET_FILE_LIST);

    send(Events.GET_FILE_LIST);

    return new Promise<IFile[]>(resolve => {

      subscribe<IFile[]>(Events.GET_FILE_LIST, (r) => {
        resolve(r);
      });
    });
  }
}

const bb = new Browser();

window.bb = bb;
