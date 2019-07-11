import { send, subscribe, connect } from '../sender';
import Adapter from './index';
import { DEV_CONNECTION_ID } from '../constants';
import { resolve } from 'path';

class Browser extends Adapter {
  public connectedPromise:Promise<any>;
  constructor () {
    super('browser');
    this.connectedPromise = this.connect();
  }

  connect () {
    return new Promise(resolve => {
      connect(DEV_CONNECTION_ID, () => {
        resolve();
      });
    });
  }

  async fetch<T> (event: string, d:any) {

    await this.connectedPromise;

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
