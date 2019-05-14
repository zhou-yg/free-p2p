/// <reference path="../typings/detect-port.d.ts" />

import * as dgram from 'dgram';

import detectPort from 'detect-port'

import { serverPort} from '../config/net';

const udpClient = dgram.createSocket('udp4');

udpClient.on('message', (b, obj) => {
  console.log(b.toString());
  console.log(obj);
})

udpClient.send('hello', serverPort, 'localhost', (e, b) => {
  console.log(e, b);
})