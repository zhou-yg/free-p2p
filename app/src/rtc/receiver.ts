import Peer from 'peerjs';
import EE from 'eventemitter3';
import { DEV_CONNECTION_ID } from './constants';
import peerConfig from './config';
import { parseBuffer } from './receiverUtils';

const eventCenter = new EE();

let lastPeerId:string;
let conn:Peer.DataConnection | null;

const peer = new Peer(DEV_CONNECTION_ID, peerConfig);

peer.on('open', function (id) {
  // Workaround for peer.reconnect deleting previous id
  if (peer.id === null) {
    console.log('Received null id from peer open');
    peer.id = lastPeerId;
  } else {
    lastPeerId = peer.id;
  }

  console.log('ID: ' + peer.id);
});
peer.on('connection', function (c) {
  // Allow only a single connection
  // if (conn) {
  //   c.on('open', function () {
  //     c.send("Already connected to another client");
  //     setTimeout(function () { c.close(); }, 500);
  //   });
  //   return;
  // }

  console.log('Client is connected. His id is = ', c.peer);
  conn = c;

  ready();
});
peer.on('disconnected', function () {
  console.log('Connection lost. Please reconnect');
  // Workaround for peer.reconnect deleting previous id
  // peer.id = lastPeerId;
  // peer.reconnect();
});
peer.on('close', function () {
  console.log('Connection destroyed');
});
peer.on('error', function (err) {
  console.error(err);
});

function ready() {
  if (conn) {
    conn.on('data', function (data) {

      let d: [string, {}];
      if (data.constructor === ArrayBuffer) {
        d = parseBuffer(data);
      } else {
        d = JSON.parse(data);
      }

      eventCenter.emit(d[0], d[1]);
    });
    conn.on('close', function () {
      conn = null;
    });
  }
}

function send (e:string, v: any) {
  if (conn) {
    conn.send(JSON.stringify([e, v]));
  }
}

export const getDataConnection = () => conn;

export const watch = (events: Array<[string, (param: any, send: (v:any) => void) => void]>) => {
  events.forEach(([event, callback]) => {
    eventCenter.on(event, (param: any) => callback(param, v => send(event, v)));
  });
}
