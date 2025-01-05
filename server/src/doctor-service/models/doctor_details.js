const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const doctor_details = sequelize.define(
    "doctor_details",
    {
      doctor_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      specialization_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
        references: {
          model: "specializations",
          key: "specialization_id",
        },
      },
      position: {
        type: DataTypes.ENUM(
          "NONE",
          "MASTER",
          "DOCTOR",
          "ASSOCIATE PROFESSOR",
          "PROFESSOR"
        ),
        allowNull: true,
      },
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      consultation_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "doctor_details",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "doctor_id" }],
        },
        {
          name: "specialization_id",
          using: "BTREE",
          fields: [{ name: "specialization_id" }],
        },
      ],
    }
  );
  doctor_details.associate = (models) => {
    doctor_details.hasMany(models.doctor_schedules, {
      as: "doctor_schedules",
      foreignKey: "doctor_id",
    });
    doctor_details.belongsTo(models.specializations, {
      as: "specialization",
      foreignKey: "specialization_id",
    });
  };
  return doctor_details;
};
