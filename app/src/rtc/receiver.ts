import Peer from 'peerjs';

let lastPeerId:string;
let peerId = null;
let conn:Peer.DataConnection | null;

const peer = new Peer(undefined, {
  debug: 2,
  host: '207.148.114.234',
  // host: 'localhost',
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
