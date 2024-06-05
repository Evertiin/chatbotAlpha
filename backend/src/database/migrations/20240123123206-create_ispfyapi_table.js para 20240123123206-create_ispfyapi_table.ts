import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryInterface.createTable('IspfyAPI', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'), // Corrigido para usar a função diretamente
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isActive: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      url: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE(6),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE(6),
      },
      tenantId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Tenants',
          key: 'id',
        },
      },
    });

    // Adiciona a chamada para a função uuid_generate_v4()
    await queryInterface.sequelize.query('ALTER TABLE "IspfyAPI" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()');
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.dropTable('IspfyAPI');
  },
};
