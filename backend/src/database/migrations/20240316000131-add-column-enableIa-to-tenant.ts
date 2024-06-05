import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        const tableInfo = await queryInterface.describeTable("Tenants");

        if (!tableInfo || !tableInfo["enableIa"]) {
            await queryInterface.addColumn("Tenants", "enableIa", {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            });
        }

        if (!tableInfo || !tableInfo["apiKey"]) {
            await queryInterface.addColumn("Tenants", "apiKey", {
                type: DataTypes.STRING,
                allowNull: true
            });
        }
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Tenants", "enableIa");
        await queryInterface.removeColumn("Tenants", "apiKey");
    },
};