import Adapter from './index';
import { send, subscribe } from '../../rtc/sender';
import { Events } from '../../rtc/events';
import { resolve } from 'path';
import {IFile} from './index';

export default class Browser extends Adapter {
  getFileList () {
    
    send(Events.GET_FILE_LIST);


    return new Promise<IFile[]>(resolve => {

      subscribe<IFile[]>(Events.GET_FILE_LIST, (r) => {
        resolve(r);
      });
    });
  }
}