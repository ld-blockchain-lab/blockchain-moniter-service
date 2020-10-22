/* eslint-disable prefer-promise-reject-errors */
import sequelize from 'sequelize';
import BaseAdaptor from '.';
import ERROR from '../../const/ERROR.json';
import { Models } from '../../db';

const { Task } = Models;

const addressReg = /^test.+$/;

export default class TestAdaptor extends BaseAdaptor {
  symbol = 'TEST'
  blockchain = 'test'

  constructor(...args) {
    super(...args);
    // 测试适配器定时塞数据
    setInterval(() => {
      Task.findOne({
        where: {
          symbol: this.symbol,
          blockchain: this.blockchain,
        },
        order: [sequelize.fn('RAND')],
        include: ['apikey'],
      }).then((a) => {
        if (!a) return;
        this.createTx(a.getData(), {
          address: a.address,
          blockchain: this.blockchain,
          network: 'main',
          status: 'pending',
          hash: `tx_${new Date().getTime()}`,
          from: '0xf50733d9809a268c717b3a782a2437cfea1006b9',
          to: a.address,
          asset: this.symbol,
          value: '1000000000000000000',
          decimals: 18,
          direction: 'incoming',
          blockNumber: null,
        });
      });
    }, 5000);
  }

  checkAddress(address) {
    return addressReg.test(address.toLowerCase());
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
