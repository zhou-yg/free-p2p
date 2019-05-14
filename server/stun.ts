/// <reference path="../typings/detect-port.d.ts" />

import * as dgram from 'dgram';

import detectPort from 'detect-port'

import { serverPort } from '../config/net';

detectPort(serverPort).then((port: number) => {

  const udpServer = dgram.createSocket('udp4');
  udpServer.bind(port);

  udpServer.on('listening', () => {
    console.log(`udpServer listen on: ${port}`);
  });

  udpServer.on('message', (msg, rinfo) => {
    console.log(msg.toString());
    console.log(rinfo);
  })
})