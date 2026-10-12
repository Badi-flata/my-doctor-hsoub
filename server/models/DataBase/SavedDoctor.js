const { DataTypes } = require('sequelize');
const DB = require('./data');

const SavedDoctor = DB.define('SavedDoctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

SavedDoctor.associate = Relations => {
  SavedDoctor.belongsTo(Relations.user, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  SavedDoctor.belongsTo(Relations.user, {
    foreignKey: 'doctorId',
    as: 'doctor'
  });
}

module.exports = SavedDoctor;