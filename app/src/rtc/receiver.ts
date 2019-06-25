import Peer from 'peerjs';
import EE from 'eventemitter3';
import { Events, DEV_CONNECTION_ID } from './events';
import { string } from 'prop-types';

const eventCenter = new EE();

let lastPeerId:string;
let conn:Peer.DataConnection | null;

console.log(2);

const peer = new Peer(DEV_CONNECTION_ID, {
  debug: 2,
  host: '207.148.114.234',
  key: 'peerjs',
  port: 9000,
  path: '/myappx',
});

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
  if (conn) {
    c.on('open', function () {
      c.send("Already connected to another client");
      setTimeout(function () { c.close(); }, 500);
    });
    return;
  }
  console.log('c.peer: ', c.peer);
  conn = c;
  console.log("Connected to: " + conn.peer);
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
      console.log('receive:', data);

      let d: [Events, {}] = JSON.parse(data);


      eventCenter.emit(d[0] as string, d[1]);
    });
    conn.on('close', function () {
      conn = null;
    });
  }
}

function send (e:Events, v: any) {
  if (conn) {
    conn.send(JSON.stringify([e, v]));
  }
}

export const getDataConnection = () => conn;

export const watch = (events: Array<[Events, (send: (v:any) => void) => void]>) => {
  events.forEach(([event, callback]) => {
    eventCenter.once(event, () => callback(v => send(event, v)));
  });
}
