const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const users = sequelize.define(
    "users",
    {
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
    
      user_role: {
        type: DataTypes.ENUM("ADMIN", "DOCTOR", "PATIENT"),
        allowNull: true,
        defaultValue: "PATIENT",
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "username",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "username_2",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username_3",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email_2",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username_4",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email_3",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username_5",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email_4",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username_6",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email_5",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username_7",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email_6",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username_8",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email_7",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username_9",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "email_8",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
      ],
    }
  );
  users.associate = (models) => {
    users.hasMany(models.user_profiles, {
      as: "user_profiles",
      foreignKey: "user_id",
    });
  };
  return users;
};
