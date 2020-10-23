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
  }
}

const hub = new Hub();
// hub.addAdaptor(TestAdaptor);
hub.addAdaptor(BlockNativeEthereumAdaptor);

export default hub;
