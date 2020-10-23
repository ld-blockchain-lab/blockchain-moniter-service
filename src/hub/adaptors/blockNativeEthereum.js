/* eslint-disable prefer-promise-reject-errors */
import { EthereumAdaptor } from '.';
import ERROR from '../../const/ERROR.json';
import fetch from '../../utils/fetch';

function parseEth(feedback) {
  const { watchedAddress, system, network, status, hash, from, to, asset, value, direction, blockNumber } = feedback;
  const ret = {
    address: watchedAddress.toLowerCase(),
    blockchain: system,
    network,
    status,
    hash: hash.toLowerCase(),
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    blockNumber,
    asset,
    value,
    decimals: 18,
    direction,
  };
  return ret;
}

function parseErc20(feedback) {
  const { watchedAddress, system, network, status, hash, from, asset, direction, contractCall, blockNumber } = feedback;
  const { contractType, contractAddress, contractDecimals, methodName, params } = contractCall;
  if (methodName !== 'transfer') return null;
  const { _to, _value } = params;
  if (!_to || !_value) return null;
  const ret = {
    address: watchedAddress.toLowerCase(),
    blockchain: system,
    network,
    status,
    hash: hash.toLowerCase(),
    from: from.toLowerCase(),
    to: _to.toLowerCase(),
    blockNumber,
    asset,
    value: _value,
    decimals: contractDecimals,
    direction,
    contractType,
    contractAddress,
  };
  return ret;
}

function parseFeedback(feedback) {
  let obj;
  const { asset, value, contractCall } = feedback;
  // 判断是ETH还是ERC20
  if (asset === 'ETH' && value > 0 && !contractCall) {
    obj = parseEth(feedback);
  }
  if (asset !== 'ETH' && contractCall && contractCall.contractType === 'erc20') {
    obj = parseErc20(feedback);
  }
  return obj;
}

export default class BlockNativeEthereumAdaptor extends EthereumAdaptor {
  name = 'BlockNativeEthereum'

  callback(feedback) {
    const txData = parseFeedback(feedback);
    this.createTx(txData);
  }

  monitor(address, apikey) {
    if (!this.checkAddress(address)) return Promise.reject(ERROR.MONI_ADDRESS_ERR);
    const { BN_URL, BN_KEY, BN_ETH_NETWORK } = this.config;
    if (!BN_URL || !BN_KEY || !BN_ETH_NETWORK) {
      return Promise.reject({
        code: 1000,
        message: 'BlockNativeEthereumAdaptor缺少BN配置参数',
      });
    }
    return fetch.post(BN_URL, {
      apiKey: BN_KEY,
      address,
      blockchain: 'ethereum',
      networks: [BN_ETH_NETWORK],
    }).then((resp) => {
      if (resp.success && resp.data.msg === 'success') {
        return this.createTask({
          apikeyId: apikey.id,
          address: address.toLowerCase(),
          monitored: true,
        }).catch((e) => Promise.reject({
          code: ERROR.COMMON.code,
          message: e.errors.map((ee) => ee.message).join(';'),
        }));
      }
      return Promise.reject({
        code: 1000,
        message: 'BlockNative返回失败或请求失败',
      });
    });
  }
}
