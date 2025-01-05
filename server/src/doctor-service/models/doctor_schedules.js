const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const doctor_schedules = sequelize.define(
    "doctor_schedules",
    {
      schedule_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      doctor_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
        references: {
          model: "doctor_details",
          key: "doctor_id",
        },
      },
      schedule_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("AVAILABLE", "BOOKED"),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "doctor_schedules",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "schedule_id" }],
        },
        {
          name: "doctor_id",
          using: "BTREE",
          fields: [{ name: "doctor_id" }],
        },
      ],
    }
  );
  doctor_schedules.associate = (models) => {
    doctor_schedules.belongsTo(models.doctor_details, {
      as: "doctor",
      foreignKey: "doctor_id",
    });
  };
  return doctor_schedules;
};
