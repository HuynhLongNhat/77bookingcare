const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const specializations = sequelize.define(
    "specializations",
    {
      specialization_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "specializations",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "specialization_id" }],
        },
      ],
    }
  );
  specializations.associate = (models) => {
    specializations.hasMany(models.doctor_details, {
      as: "doctor_details",
      foreignKey: "specialization_id",
    });
  };
  return specializations;
};
