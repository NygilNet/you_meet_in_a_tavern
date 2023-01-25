'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group, { foreignKey: 'groupId' });
      Event.belongsTo(models.Venue, { foreignKey: 'venueId' });
      Event.hasMany(models.EventImage, { foreignKey: 'eventId' });
      Event.hasMany(models.Attendance, { foreignKey: 'eventId' });
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [5,255]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(['Online', 'In Person']),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In Person']]
      }
    },
    capacity: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: Date()
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: this.startDate
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
