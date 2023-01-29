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
      name: 'How to Run a TTRPG Game',
      description: 'Aenean laoreet metus et ex pellentesque faucibus. Maecenas cursus non purus ac accumsan.',
      type: 'In Person',
      capacity: 15,
      price: 0,
      startDate: Date.parse('2023-02-06'),
      endDate: Date.parse('2023-02-12')
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'First CoS Campaign - 5 Players ONLY',
      description: 'Aliquam gravida velit sem, sit amet gravida lectus mollis eu. Mauris varius sollicitudin rutrum.',
      type: 'Online',
      capacity: 6,
      price: 4.99,
      startDate: Date.parse('2023-10-06'),
      endDate: Date.parse('2023-10-31')
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Session 0 - Creating a Pathfinder Character',
      description: 'Sed fermentum tristique orci, sit amet porta nunc dictum a.',
      type: 'Online',
      capacity: 10,
      price: 0,
      startDate: Date.parse('2023-02-12'),
      endDate: Date.parse('2023-02-18')
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['Online', 'In Person'] }
    }, {});
  }
};
