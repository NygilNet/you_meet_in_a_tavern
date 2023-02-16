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
   options.tableName = 'Events';
   return queryInterface.bulkInsert(options, [
    {
      venueId: 1,
      groupId: 1,
      name: 'How To Get Players Engaged',
      description: 'Aenean laoreet metus et ex pellentesque faucibus. Maecenas cursus non purus ac accumsan.',
      type: 'In Person',
      capacity: 15,
      price: 0,
      startDate: new Date(2023, 3, 11, 20, 15),
      endDate: new Date(2023, 3, 11, 22)
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'First CoS Campaign - 5 Players ONLY',
      description: 'Aliquam gravida velit sem, sit amet gravida lectus mollis eu. Mauris varius sollicitudin rutrum.',
      type: 'Online',
      capacity: 6,
      price: 4.99,
      startDate: new Date(2023, 8, 20, 8, 30),
      endDate: new Date(2023, 8, 20, 11)
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Finding Our Own Path',
      description: 'Sed fermentum tristique orci, sit amet porta nunc dictum a.',
      type: 'Online',
      capacity: 10,
      price: 0,
      startDate: new Date(2023, 8, 6, 13),
      endDate: new Date(2023, 8, 6, 14, 30)
    },
    {
      venueId: null,
      groupId: 1,
      name: 'How To Play Pass Level 12',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum sed turpis ac tristique. Maecenas arcu orci, molestie ac sem a, dapibus luctus ante.',
      type: 'Online',
      capacity: null,
      price: 0,
      startDate: new Date(2023, 5, 3, 11, 10),
      endDate: new Date(2023, 5, 3, 13)
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['Online', 'In Person'] }
    }, {});
  }
};
