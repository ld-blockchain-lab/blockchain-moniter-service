import thevar from './var';
import apikey from './apikey';
import task from './task';

const Models = {};

function model(sequelize) {
  Models.Var = thevar(sequelize);
  Models.Apikey = apikey(sequelize);
  Models.Task = task(sequelize);

  // 关系
  Models.Task.belongsTo(Models.Apikey, { as: 'apikey' });

  return Models;
}

export default model;
