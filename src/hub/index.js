// import TestAdaptor from './adaptors/test';
import BlockNativeEthereumAdaptor from './adaptors/blockNativeEthereum';
import fetch from '../utils/fetch';
import { Models } from '../db';

const { Task } = Models;

class Hub {
  createTx = (adaptor, txData) => {
    Task.findAll({
      where: {
        address: txData.address,
        symbol: adaptor.symbol,
        blockchain: adaptor.blockchain,
      },
      include: ['apikey'],
    }).then((tasks) => {
      tasks.forEach((taskRaw) => {
        const task = taskRaw.getData();
        const data = {
          task,
          tx: txData,
        };
        fetch.post(task.apikey.webhook, data);
      });
    });
  }

  createTest = (adaptor, apikey, txData) => {
    const data = {
      task: {
        address: txData.address,
        type: 'tx',
        symbol: adaptor.symbol,
        blockchain: adaptor.blockchain,
        monitored: true,
        test: true,
        apikey: apikey.getData(),
      },
      tx: txData,
    };
    fetch.post(apikey.webhook, data);
  }

  addAdaptor(Factory) {
    const adaptor = new Factory(JSON.parse(process.env.ADAPTOR_CONFIG));
    if (!adaptor.symbol) return;
    Object.defineProperty(this, adaptor.symbol.toUpperCase(), {
      configurable: true,
      enumerable: true,
      get() {
        return adaptor;
      },
    });
    Object.defineProperty(this, adaptor.blockchain.toLowerCase(), {
      configurable: true,
      enumerable: true,
      get() {
        return adaptor;
      },
    });
    Object.defineProperty(this, adaptor.name, {
      configurable: true,
      enumerable: true,
      get() {
        return adaptor;
      },
    });
    adaptor.on('create_tx', (txData) => {
      if (!txData) return;
      this.createTx(adaptor, txData);
    });
    adaptor.on('create_test', (txData, apikey) => {
      if (!txData || !apikey) return;
      this.createTest(adaptor, apikey, txData);
    });
  }
}

const hub = new Hub();
// hub.addAdaptor(TestAdaptor);
hub.addAdaptor(BlockNativeEthereumAdaptor);

export default hub;
