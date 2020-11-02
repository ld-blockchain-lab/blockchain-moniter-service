/* eslint-disable no-unused-vars */
import { EventEmitter } from 'events';
import { Models } from '../../db';

const { Task } = Models;

export default class BaseAdaptor extends EventEmitter {
  name
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

  test(address, apikey) {
    const txData = this.getTestData(address);
    this.emit('create_test', txData, apikey);
  }

  // 需要实现的函数
  init() {}

  getTestData(address) {
    return {
      address,
    };
  }

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

  getTestData(address) {
    return {
      address,
      blockchain: 'ethereum',
      network: 'goerli',
      status: 'pending',
      hash: '0x22bf0d8347b77f622105581f6deba4a0511f2801bf2b8b5bc8b9429ee90ca1e2',
      from: '0xb6cb15ef5b6f35a08fb7374664fb43989d0d5aef',
      to: '0xc85ae8b98a2325e3a7a209a577c15eb9cd583701',
      blockNumber: null,
      asset: 'ETH',
      value: '4000000000000000',
      decimals: 18,
      direction: 'incoming',
    };
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
