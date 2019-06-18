import Peer from 'peerjs';

const peer = new Peer(undefined, {
  debug: 2,
  host: '207.148.114.234',
  // host: 'localhost',
  key: 'peerjs',
  port: 9000,
  path: '/myappx',
});
