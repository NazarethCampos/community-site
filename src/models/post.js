'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author'
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: 'comments',
        onDelete: 'CASCADE'
      });
      Post.hasMany(models.PostLike, {
        foreignKey: 'postId',
        as: 'postLikes',
        onDelete: 'CASCADE'
      });
    }
  }

  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '갤러리',
      validate: {
        isIn: [['갤러리', '영상', '신앙나눔']]
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts'
  });

  return Post;
};
