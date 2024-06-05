import Setting from "../../models/Setting";

const createSetting = async (tenantId: any, key: string, value: string) => {
  // Verifica se a configuração já existe para o tenantId e key específicos
  const existingSetting = await Setting.findOne({
    where: {
      tenantId: Number(tenantId),
      key,
    },
  });

  if (existingSetting) {
    // Configuração já existe, você pode optar por não criar uma nova ou atualizar a existente
    console.log(`Configuração com a chave ${key} já existe para o tenantId ${tenantId}.`);
    return existingSetting;
  }

  // Configuração não existe, cria uma nova
  try {
    const newSetting = await Setting.create({
      key,
      value,
      createdAt: new Date(),
      updatedAt: new Date(),
      tenantId: Number(tenantId),
    });
    return newSetting;
  } catch (error) {
    console.error("Erro ao criar configuração:", error);
    throw error;
  }
};

const CreateDefaultSettings = async (tenantId: string | number) => {
  const settings = [
    createSetting(tenantId, 'userCreation', 'disabled'),
    createSetting(tenantId, 'NotViewTicketsQueueUndefined', 'disabled'),
    createSetting(tenantId, 'NotViewTicketsChatBot', 'disabled'),
    createSetting(tenantId, 'NotViewAssignedTickets', 'disabled'),
    createSetting(tenantId, 'DirectTicketsToWallets', 'disabled'),
    createSetting(tenantId, 'botTicketActive', 'disabled'),
    createSetting(tenantId, 'rejectCalls', 'disabled'),
    createSetting(tenantId, 'callRejectMessage', 'As chamadas de voz e vídeo estão desabilitas para esse WhatsApp, favor enviar uma mensagem de texto'),
    createSetting(tenantId, 'userDisableSignature', 'enabled'),
    createSetting(tenantId, 'ignoreGroupMsg', 'disabled'),
    createSetting(tenantId, 'userContactWallet', 'disabled'),
  ];

  try {
    const createdSettings = await Promise.all(settings);
    return createdSettings;
  } catch (error) {
    console.error("Erro ao criar configurações padrão:", error);
    throw error;
  }
};

export default CreateDefaultSettings;
