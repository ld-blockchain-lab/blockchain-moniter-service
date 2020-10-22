/* eslint-disable no-param-reassign */
import Sequelize from 'sequelize';
import uuidAPIKey from 'uuid-apikey';

const { Model } = Sequelize;

class Apikey extends Model {
  getData() {
    const ret = {
      webhook: this.webhook,
      apikey: this.apikey,
    };
    return ret;
  }
}

function model(sequelize) {
  Apikey.init({
    // 地址
    webhook: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    apikey: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'apikey',
    hooks: {
      beforeValidate: (instance) => {
        const key = uuidAPIKey.create();
        instance.uuid = key.uuid;
        instance.apikey = key.apiKey;
      },
    },
  });
  return Apikey;
}

export default model;
