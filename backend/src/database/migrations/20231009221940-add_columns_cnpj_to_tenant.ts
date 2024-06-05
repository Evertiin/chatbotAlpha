import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const tableInfo = await queryInterface.describeTable("Tenants");

    if (!tableInfo || !tableInfo["cnpj"]) {
        await queryInterface.addColumn("Tenants", "cnpj", {
          type: DataTypes.STRING,
          allowNull: false,
        });
      }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Tenants", "cnpj");
  },
};