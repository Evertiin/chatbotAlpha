import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        const tableInfo = await queryInterface.describeTable("Queues");

        if (!tableInfo || !tableInfo["prompt"]) {
            await queryInterface.addColumn("Queues", "prompt", {
                type: DataTypes.TEXT,
                allowNull: true
            });
        }
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Queues", "prompt");
    },
};