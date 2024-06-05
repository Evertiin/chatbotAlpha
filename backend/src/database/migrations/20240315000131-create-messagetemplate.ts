import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("MessageTemplate", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            tenantId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            trans_status_code: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            whatsappId: { // Nova coluna para armazenar o whatsappId
                type: DataTypes.INTEGER,
                references: { model: "Whatsapps", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
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
        return queryInterface.dropTable("MessageTemplate");
    }
};
