const sequelize = require('./connect.js');

(async () => {
  await sequelize.sync({ force: true });
})();
console.log('successfully sync [ (re)created the database ]!');
(async () => {
  /*await sequelize.close();*/
})();
