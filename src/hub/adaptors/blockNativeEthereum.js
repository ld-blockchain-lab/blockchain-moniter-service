/* eslint-disable prefer-promise-reject-errors */
import { EthereumAdaptor } from '.';
import ERROR from '../../const/ERROR.json';
import log from '../../utils/log';

export default class BlockNativeEthereumAdaptor extends EthereumAdaptor {
  name = 'BlockNativeEthereum'

  callback(data) {
    log('【获得BlockNative回报】', data);
  }

  monitor(address, apikey) {
    if (!this.checkAddress(address)) return Promise.reject(ERROR.MONI_ADDRESS_ERR);
    return this.createTask({
      apikeyId: apikey.id,
      address: address.toLowerCase(),
      monitored: true,
    }).catch((e) => Promise.reject({
      code: ERROR.COMMON.code,
      message: e.errors.map((ee) => ee.message).join(';'),
    }));
  }
}
