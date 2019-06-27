import { send, subscribe } from '../sender';
import Adapter from './index';

class Browser extends Adapter {
  constructor () {
    super('browser')
  }

  fetch<T> (event: string, d:any) {

    console.log('send event:', event);

    send(event, d);

    return new Promise<T>(resolve => {

      subscribe<T>(event, (r) => {
        resolve(r);
      });
    });
  }
}


window.presetApi = (e?: any): Adapter => {
  return new Browser();
};
