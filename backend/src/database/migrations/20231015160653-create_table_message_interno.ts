import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("InternalMessage", {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            mediaType: {
                type: DataTypes.STRING
            },
            mediaUrl: {
                type: DataTypes.STRING
            },
            senderId: {
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            receiverId: {
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            groupId: {
                type: DataTypes.INTEGER,
                references: { model: "Groups", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            tenantId: {
                type: DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: false,
                defaultValue: 1
            },
            timestamp: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE(6),
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE(6),
                allowNull: false
            }
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable("InternalMessage");
    }
};