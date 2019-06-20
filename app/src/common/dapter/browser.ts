import Adapter from './index';
import {sender} from '../../rtc/sender';

export default class Browser extends Adapter {
  getFileList () {
    return [];
  }
}