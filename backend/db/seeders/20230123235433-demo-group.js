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
   options.tableName = 'Groups';
   return queryInterface.bulkInsert(options, [
    {
      organizerId: 1,
      name: 'GM Workshop for Beginners',
      about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere purus at dui volutpat',
      type: 'In Person',
      private: false,
      city: 'Dallas',
      state: 'TX'
    },
    {
      organizerId: 3,
      name: 'Running Curse of Strahd',
      about: 'Aliquam ullamcorper, leo non mollis lobortis, elit nunc feugiat lacus, quis tincidunt ante mi id dolor.',
      type: 'Online',
      private: true,
      city: 'Chicago',
      state: 'IL'
    },
    {
      organizerId: 2,
      name: 'Pathfinder 2e Game for New Players',
      about: 'Quisque lacinia quam et varius vestibulum. Vestibulum pretium, dui ac tempus viverra, mauris ipsum finibus ex',
      type: 'Online',
      private: false,
      city: 'New York',
      state: 'NY'
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
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['GM Workshop for Beginners', 'Running Curse of Strahd', 'Pathfinder 2e Game for New Players'] }
    }, {});
  }
};
