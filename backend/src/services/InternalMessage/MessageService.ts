import { Op } from "sequelize";
import InternalMessage from '../../models/InternalMessage';
import User from "../../models/User";

class MessageService {
  static async listarMensagens(id: number, contactId, isGroup) {
    try {
      let mensagens;
      if (isGroup == 'false') {
        mensagens = await InternalMessage.findAll({
          where: {
            [Op.or]: [
              { senderId: id, receiverId: contactId },
              { receiverId: id, senderId: contactId }
            ]
          },
          include: [
            { model: User, as: 'sender', attributes: ["id", "name"] },
            { model: User, as: 'receiver', attributes: ["id", "name"] }
          ],
          order: [
            'timestamp',
          ],
          limit: 500
        });
      } else {
        mensagens = await InternalMessage.findAll({
          where: {
            groupId: contactId
          },
          include: [
            { model: User, as: 'sender', attributes: ["id", "name"] },
            { model: User, as: 'receiver', attributes: ["id", "name"] }
          ],
          order: [
            'timestamp',
          ],
          limit: 500
        });
      }
      return mensagens;
    } catch (error) {
      throw error;
    }
  }

  static async criarMensagem(messageData) {
    try {
      return await InternalMessage.create(messageData);
    } catch (error) {
      throw error;
    }
  }

  static async marcarMensagemNaoLida(mensagemId) {
    try {
      const mensagem = await InternalMessage.findByPk(mensagemId);

      if (!mensagem) {
        throw new Error('Mensagem não encontrada.');
      }

      await mensagem.update({ isUnread: true });
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;
