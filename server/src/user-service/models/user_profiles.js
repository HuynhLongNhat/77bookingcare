const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const user_profiles = sequelize.define(
    "user_profiles",
    {
      profile_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      full_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("M", "F", "OTHER"),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "user_profiles",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "profile_id" }],
        },
        {
          name: "user_id",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
  user_profiles.associate = (models) => {
    user_profiles.belongsTo(models.users, {
      as: "user",
      foreignKey: "user_id",
    });
  };
  return user_profiles;
};
