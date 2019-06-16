/// <reference path="../typings/detect-port.d.ts" />

import * as dgram from 'dgram';

import detectPort from 'detect-port'

import { serverPort } from '../config/net';


class ClientManager {
  private clientPool: dgram.RemoteInfo[];
  constructor () {
    this.clientPool = [];
  }
  add (rinfo: dgram.RemoteInfo) {
    let r = this.clientPool.find((v) => v.address === rinfo.address && v.port === rinfo.port);
    if (!r) {
      this.clientPool.push(rinfo);
    }
  }
  syncNodes(udpSocket:dgram.Socket) {
    let list = this.clientPool.map(v => `${v.address}:${v.port}`).join(',');
    this.clientPool.forEach(info => {
      udpSocket.send(list, info.port, info.address, (e) => {
        e && console.log(`e:`, e);
      })
    })
  }
  brodcast (udpSocket: dgram.Socket, msg:string) {
    this.clientPool.forEach(info => {
      udpSocket.send(msg, info.port, info.address, (e) => {
        e && console.log(`e:`, e);
      })
    })
  }
}

detectPort(serverPort).then((port: number) => {
  const cm = new ClientManager();
  const udpServer = dgram.createSocket('udp4');
  udpServer.bind(port);

  udpServer.on('listening', () => {
    console.log(`udpServer listen on: ${port}`);
  });

  udpServer.on('message', (msg, rinfo: dgram.RemoteInfo) => {
    
    console.log(msg.toString());
    console.log(rinfo);

    cm.add(rinfo);

    udpServer.send('receive your msg', rinfo.port, rinfo.address, (e, bytes) => {
      console.log(e, bytes);
    });

    cm.syncNodes(udpServer);
  })
})
