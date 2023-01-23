'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, { foreignKey: 'eventId' });
    }
  }
  EventImage.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
        isImageUrl(val) {
          const ext = val.split('.')[1];
          const images = ['img', 'jpeg', 'png'];

          if (!images.includes(ext)) {
            throw new Error('value must be an image url');
          }
        }
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
