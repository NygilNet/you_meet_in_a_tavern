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
   options.tableName = 'GroupImages';
   return queryInterface.bulkInsert(options, [
    {
      groupId: 1,
      url: 'https://foo.com',
      preview: true
    },
    {
      groupId: 2,
      url: 'https://bar.com',
      preview: true
    },
    {
      groupId: 3,
      url: 'https://faz.com',
      preview: true
    },
   ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: ['true', 'false'] }
    }, {});
  }
};
