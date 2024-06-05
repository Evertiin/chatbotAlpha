import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        const tableInfo = await queryInterface.describeTable("Queues");

        if (!tableInfo || !tableInfo["cnpj"]) {
            await queryInterface.addColumn("Queues", "from_ia", {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Queues", "from_ia");
    },
};