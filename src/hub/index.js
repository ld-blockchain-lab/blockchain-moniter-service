import TestAdaptor from './adaptors/test';
import fetch from '../utils/fetch';

class Hub {
  createTx = (task, txData) => {
    const data = {
      task,
      tx: txData,
    };
    fetch.post(task.apikey.webhook, data);
  }

  addAdaptor(Factory) {
    const adaptor = new Factory(process.env.ADAPTOR_CONFIG);
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
    adaptor.on('create_tx', this.createTx);
  }
}

const hub = new Hub();
// hub.addAdaptor(TestAdaptor);

export default hub;
