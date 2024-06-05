import { QueryInterface, DataTypes, Sequelize } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("InternalMessage", "groupId", {
                type: DataTypes.INTEGER,
                references: { model: "Groups", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true
            }),
            queryInterface.changeColumn("InternalMessage", "receiverId", {
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                allowNull: true
            })
        ]);
    },

    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("InternalMessage", "groupId", {
                type: DataTypes.INTEGER,
                references: { model: "Groups", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true
            }),
            queryInterface.changeColumn("InternalMessage", "receiverId", {
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                allowNull: true
            })
        ]);
    }
};
