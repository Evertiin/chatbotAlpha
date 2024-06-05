import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("ReadMessageGroups", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            internalMessageId: {
                type: DataTypes.BIGINT,
                references: { model: "InternalMessage", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            userGroupId: {
                type: DataTypes.INTEGER,
                references: { model: "UsersGroups", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable("ReadMessageGroups");
    }
};