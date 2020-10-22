/* eslint-disable no-unused-vars */
import { EventEmitter } from 'events';
import { Models } from '../../db';

const { Task } = Models;

export default class BaseAdaptor extends EventEmitter {
  symbol
  blockchain
  config

  constructor(config) {
    super();
    this.config = config;
  }

  createTx(task, txData) {
    this.emit('create_tx', task, txData);
  }

  createTask(data) {
    const payload = {
      symbol: this.symbol,
      blockchain: this.blockchain,
      ...data,
    };
    return Task.create(payload);
  }

  // 需要实现的函数

  // 返回地址是否正确
  checkAddress(address) {
    throw Error();
  }

  monitor(address, apikey) {
    throw Error();
    // 返回promise，bool
  }

  cancel(address, apikey) {
    throw Error();
    // 返回promise，bool
  }

  isAddressMonitored(address, apikey) {
    throw Error();
    // 返回promise，bool
  }
}
