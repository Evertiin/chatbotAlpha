import { QueryInterface, DataTypes, Sequelize } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.removeConstraint("Tenants", "Tenants_ownerId_fkey"),
            queryInterface.changeColumn("Tenants", "ownerId", {
                type: DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true
            })
        ]);
    },

    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("Tenants", "ownerId", {
                type: DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true
            })
        ]);
    }
};
