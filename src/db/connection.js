const Sequelize = require("sequelize");

const sequelize = new Sequelize("imobiliaria", "root", "", {
  host: "localhost",
  dialect: "mariadb"
});

sequelize.sync();

exports.sequelize = sequelize;
