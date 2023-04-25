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
      url: 'https://images.unsplash.com/photo-1632758479790-50d04c86b97d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80',
      preview: true
    },
    {
      groupId: 2,
      url: 'https://images.unsplash.com/photo-1613469425754-bf71d7280f65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
      preview: true
    },
    {
      groupId: 3,
      url: 'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
      preview: true
    },
    {
      groupId: 1,
      url: 'https://images.unsplash.com/photo-1557218351-1a230b6e5650?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
      preview: false
    },
    {
      groupId: 4,
      url: 'https://images.unsplash.com/photo-1515734392280-e60c25eb9f01?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
      preview: true
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: ['true', 'false'] }
    }, {});
  }
};
