module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
      token: { type: DataTypes.STRING, allowNull: false, unique: true },
     
    }, { timestamps: true });
  
    return Notification;
  };