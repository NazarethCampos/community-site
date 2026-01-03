'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    static associate(models) {
      PostLike.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
      PostLike.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  PostLike.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PostLike',
    tableName: 'PostLikes'
  });

  return PostLike;
};
