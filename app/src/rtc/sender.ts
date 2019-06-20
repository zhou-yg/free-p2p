import Peer from 'peerjs';

let lastPeerId:string;
let conn: Peer.DataConnection;

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
peer.on('disconnected', function () {
  console.log('Connection lost. Please reconnect');

  // Workaround for peer.reconnect deleting previous id
  peer.id = lastPeerId;
  peer.reconnect();
});
peer.on('close', function () {
  conn = null;
  console.log('Connection destroyed');
});
peer.on('error', function (err) {
  console.log(err);
  alert('' + err);
});


export const connectTo = (id:string) => {
  conn = peer.connect(id, {
    reliable: true
  });

  conn.on('open', function () {
    console.log("Connected to: " + conn.peer);

    // Check URL params for comamnds that should be sent immediately
    // conn.send(command);
  });
  // Handle incoming data (messages only since this is the signal sender)
  conn.on('data', function (data) {
  });
  conn.on('close', function () {
  });

}

export const getSender = () => conn;
