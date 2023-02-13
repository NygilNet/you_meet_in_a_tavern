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
    options.tableName = 'Venues';
   return queryInterface.bulkInsert(options, [
    {
      groupId: 1,
      address: '1314 Inwood Rd',
      city: 'Dallas',
      state: 'TX',
      lat: 32.777,
      lng: -96.808
    },
    {
      groupId: 2,
      address: 'Online',
      city: 'Chicago',
      state: 'IL',
      lat: 41.881,
      lng: -87.623
    },
    {
      groupId: 3,
      address: 'Online',
      city: 'New York',
      state: 'NY',
      lat: 40.730,
      lng: -73.935
    },
    {
      groupId: 4,
      address: '2345 Musgrave Street',
      city: 'Townsville',
      state: 'XX',
      lat: 38.851,
      lng: -84.377
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['1314 Inwood Rd', 'Online', '2345 Musgrave Street'] }
    }, {});
  }
};
