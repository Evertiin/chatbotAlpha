import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const tableInfo = await queryInterface.describeTable("Whatsapps");

    if (!tableInfo || !tableInfo["is_open_ia"]) {
      await queryInterface.addColumn("Whatsapps", "is_open_ia", {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      });
    }

    if (!tableInfo || !tableInfo["queue_transf"]) {
        await queryInterface.addColumn("Whatsapps", "queue_transf", {
          type: DataTypes.INTEGER,
          allowNull: true,
        });
      }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Whatsapps", "is_open_ia");
    await queryInterface.removeColumn("Whatsapps", "queue_transf");
  },
};