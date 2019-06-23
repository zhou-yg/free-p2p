import Peer from 'peerjs';
import EE from 'eventemitter3';
import { Events } from './events';

const eventCenter = new EE();

let lastPeerId:string;
let conn:Peer.DataConnection | null;

console.log(2);

const peer = new Peer(undefined, {
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

  conn = c;
  console.log("Connected to: " + conn.peer);
  ready();
});
peer.on('disconnected', function () {
  console.log('Connection lost. Please reconnect');

  // Workaround for peer.reconnect deleting previous id
  peer.id = lastPeerId;
  peer.reconnect();
});
peer.on('close', function () {
  console.log('Connection destroyed');
});
peer.on('error', function (err) {
  console.error(err);
});

function ready() {
  if (conn) {
    // conn.on('data', function (data) {
    //   console.log("Data recieved");
    // });
    conn.on('close', function () {
      conn = null;
    });
  }
}

export const getDataConnection = () => conn;

export const watch = (events: Array<[Events, () => void]>) => {
  events.forEach(([event, callback]) => {
    if (conn) {
      eventCenter.emit(event, callback)
    }
  });
}
