module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
      from: { type: DataTypes.STRING, allowNull: false },
      to: { type: DataTypes.STRING, allowNull: false }, // userId or roomId
      text: { type: DataTypes.TEXT },
      media: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM("sent", "delivered", "seen"), defaultValue: "sent" }
    }, { timestamps: true });
  
    return Message;
  };
  