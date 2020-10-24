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
    webhook: {
      type: Sequelize.STRING,
    },
    sms: {
      type: Sequelize.STRING,
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
    validate: {
      bothCoordsOrNone() {
        if ((this.webhook === null) && (this.sms === null)) {
          throw new Error('Sms and Webhook cannot all be null');
        }
      },
    },
  });
  return Apikey;
}

export default model;
