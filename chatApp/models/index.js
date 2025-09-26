const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: "postgres",
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Message = require("./message")(sequelize, Sequelize);
db.Notification = require("./notification")(sequelize, Sequelize);

module.exports = db;
