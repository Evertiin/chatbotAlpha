import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const tableInfo = await queryInterface.describeTable("Messages");

    if (!tableInfo || !tableInfo["dataJson"]) {
      await queryInterface.addColumn("Messages", "dataJson", {
        type: DataTypes.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Messages", "dataJson");
  },
};