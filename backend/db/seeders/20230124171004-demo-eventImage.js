'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'EventImages';
   return queryInterface.bulkInsert(options, [
    {
      eventId: 1,
      url: 'https://asap.com',
      preview: true
    },
    {
      eventId: 2,
      url: 'https://atm.com',
      preview: true
    },
    {
      eventId: 3,
      url: 'https://aao.com',
      preview: true
    },
   ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: ['true', 'false'] }
    }, {});
  }
};
