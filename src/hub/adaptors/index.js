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
    this.init();
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
  init() {}

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

const regexes = {
  BTC: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
  ETH: /^0x[a-fA-F0-9]{40}$/,
};

class EthereumAdaptor extends BaseAdaptor {
  symbol = 'ETH'
  blockchain = 'ethereum'

  checkAddress(address) {
    return regexes.ETH.test(address.toLowerCase());
  }
}

class BitcoinAdaptor extends BaseAdaptor {
  symbol = 'BTC'
  blockchain = 'bitcoin'

  checkAddress(address) {
    return regexes.ETH.test(address.toLowerCase());
  }
}

export {
  EthereumAdaptor,
  BitcoinAdaptor,
};
