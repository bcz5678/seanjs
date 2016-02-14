"use strict";

module.exports = function(sequelize, DataTypes) {

  var Message = sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gigId: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    read: DataTypes.BOOLEAN,
    starred: DataTypes.BOOLEAN,
    label: DataTypes.STRING,
    folder: DataTypes.STRING,
    updated: DataTypes.DATE,
  }, {
    associate: function(models) {
      Message.belongsTo(models.user);
    }
  });
  return Message;
};

