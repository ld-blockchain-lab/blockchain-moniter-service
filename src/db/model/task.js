/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import Sequelize from 'sequelize';

const { Model } = Sequelize;

class Task extends Model {
  getData() {
    const ret = {
      address: this.address,
      type: this.type,
      symbol: this.symbol,
      blockchain: this.blockchain,
      monitored: this.monitored,
    };
    if (this.apikey) {
      ret.apikey = this.apikey.getData();
    }
    return ret;
  }
}

function model(sequelize) {
  Task.init({
    // api
    apikeyId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    // 地址
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('tx'),
      allowNull: false,
      defaultValue: 'tx',
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    blockchain: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    monitored: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    indexes: [{
      fields: ['apikeyId', 'address', 'type', 'symbol', 'blockchain'],
      unique: true,
    }],
    sequelize,
    modelName: 'task',
  });
  return Task;
}

export default model;
