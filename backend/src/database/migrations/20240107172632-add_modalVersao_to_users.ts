'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('Users', 'modalVersao', {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('Users', 'modalVersao');
  }
};
