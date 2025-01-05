var DataTypes = require("sequelize").DataTypes;
var _doctor_details = require("./doctor_details");
var _doctor_schedules = require("./doctor_schedules");
var _specializations = require("./specializations");

function initModels(sequelize) {
  var doctor_details = _doctor_details(sequelize, DataTypes);
  var doctor_schedules = _doctor_schedules(sequelize, DataTypes);
  var specializations = _specializations(sequelize, DataTypes);

  doctor_schedules.belongsTo(doctor_details, { as: "doctor", foreignKey: "doctor_id"});
  doctor_details.hasMany(doctor_schedules, { as: "doctor_schedules", foreignKey: "doctor_id"});
  doctor_details.belongsTo(specializations, { as: "specialization", foreignKey: "specialization_id"});
  specializations.hasMany(doctor_details, { as: "doctor_details", foreignKey: "specialization_id"});

  return {
    doctor_details,
    doctor_schedules,
    specializations,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
