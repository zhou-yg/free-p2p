import Peer from 'peerjs';
import EE from 'eventemitter3';
import peerConfig from './config';

const CONNECT_FAIL = 'peer-unavailable';

const eventCenter = new EE();

let lastPeerId:string;
let conn: Peer.DataConnection | null;

const peer = new Peer(undefined, peerConfig);


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
  console.log(err);
  if (err.type === CONNECT_FAIL) {
    eventCenter.emit('error', {
      message: err.message,
    });
  } else {
    alert('' + err);
  }
});

export const connect = (id:string, cb: () => void) => {
  conn = peer.connect(id, {
    reliable: true
  });

  conn.on('open', function () {
    console.log("Connected to: " + (conn ? conn.peer : 'conn is null'));

    cb();
    // Check URL params for comamnds that should be sent immediately
    // conn.send(command);
  });
  // Handle incoming data (messages only since this is the signal sender)
  conn.on('data', function (data:string) {
    let d:[string, {}] = JSON.parse(data);

    console.log('receive:', d);

    eventCenter.emit(d[0] as string, d[1]);
  });
  conn.on('close', function () {
  });
}

export const send = (s:string, d:any) => {
  if (conn) {
    if (d && d.constructor === Blob) {
      const newBlob = new Blob([s, ';', d]);
      conn.send(newBlob);
    } else {
      conn.send(JSON.stringify([s, d]))
    }
  } else {
    throw new Error('conn is null');
  }
};

// type FSubscribe<T> = (actionType: Events, cb: (r: T) => void) => void;

export function subscribe<T>(actionType: string, cb: (r: T) => void): void {
  eventCenter.once(actionType, cb);
}
