import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const tableInfo = await queryInterface.describeTable("Tickets");

    if (!tableInfo || !tableInfo["is_chat_ia"]) {
      await queryInterface.addColumn("Tickets", "is_chat_ia", {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Tickets", "is_chat_ia");
  },
};