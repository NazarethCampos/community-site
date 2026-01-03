'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'authorId',
        as: 'posts'
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments'
      });
      User.hasMany(models.PostLike, {
        foreignKey: 'userId',
        as: 'likes'
      });
    }

    // 비밀번호 검증 메서드
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    // JSON 변환 시 비밀번호 제외
    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password;
      return values;
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
};
