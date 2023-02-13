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
   options.tableName = 'Attendances';
   return queryInterface.bulkInsert(options, [
    {
      eventId: 1,
      userId: 2,
      status: 'member'
    },
    {
      eventId: 1,
      userId: 3,
      status: 'pending'
    },
    {
      eventId: 1,
      userId: 5,
      status: 'member'
    },
    {
      eventId: 2,
      userId: 1,
      status: 'co-host'
    }
   ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['pending', 'waitlist', 'member', 'co-host'] }
    }, {});
  }
};
