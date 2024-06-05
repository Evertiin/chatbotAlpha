import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        const tableInfo = await queryInterface.describeTable("Groups");

        if (!tableInfo || !tableInfo["tenantId"]) {
            await queryInterface.addColumn("Groups", "tenantId", {
                type: DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            });
        }

        if (!tableInfo || !tableInfo["isActive"]) {
            await queryInterface.addColumn("Groups", "isActive", {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            });
        }
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Groups", "tenantId");
        await queryInterface.removeColumn("Groups", "isActive");
    },
};