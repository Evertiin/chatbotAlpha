
import { getIO } from "../libs/socket";
import InternalMessage from "../models/InternalMessage";
import User from "../models/User";
import ListCountUnreadMessage from "../services/InternalMessage/ListCountUnreadMessage";
import MessageService from "../services/InternalMessage/MessageService";
import ReadMessageService from "../services/InternalMessage/ReadMessageService";
import { logger } from "../utils/logger";

export const listarMensagens = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.params
    const { isGroup } = req.query

    const mensagens = await MessageService.listarMensagens(id, userId, isGroup);
    return res.status(200).json({ mensagens });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao listar as mensagens.' });
  }
};

// Função para criar uma nova mensagem
export const criarMensagem = async (req, res) => {
  try {
    const { text, timestamp, receiverId, isGroup } = req.body;
    const { id, tenantId } = req.user;
    const medias = req.files as Express.Multer.File[];
    const io = getIO();
    // !!date ? date : new Date().getTime()
    const messageData = {
      text,
      timestamp,
      receiverId,
      senderId: id,
      tenantId,
      groupId: null,
      mediaType: "chat",
      mediaUrl: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isGroup === true || isGroup === 'true') {
      messageData.receiverId = undefined;
      messageData.groupId = receiverId;
    }

    let mensagem = {} as InternalMessage | null
    if (medias && medias.length > 0) { // Verifica se há mídia a ser processada
      await Promise.all(
        medias.map(async (media: Express.Multer.File | any) => {
          try {
            if (!media.filename) {
              const ext = media.mimetype.split("/")[1].split(";")[0];
              media.filename = `${new Date().getTime()}.${ext}`;
            }
          } catch (err) {
            logger.error(err);
          }

          const message = {
            ...messageData,
            text: media.originalname,
            mediaUrl: media.filename,
            mediaType:
              media.mediaType ||
              media.mimetype.substr(0, media.mimetype.indexOf("/"))
          };

          const msgCreated = await MessageService.criarMensagem(message);

          mensagem = await InternalMessage.findByPk(msgCreated.id);
          if (!mensagem) {
            throw new Error("ERR_CREATING_MESSAGE_SYSTEM");
          }
        })
      );
    } else {
      mensagem = await MessageService.criarMensagem(messageData);
    }

    const createdMessage = await InternalMessage.findOne({
      where: { id: mensagem.id },
      include: [
        { model: User, as: 'sender', attributes: ["id", "name"] },
        { model: User, as: 'receiver', attributes: ["id", "name"] }
      ],
    });

    io.emit(`${tenantId}:mensagem-chat-interno`, {
      action: "update",
      data: {
        id: createdMessage!.id,
        receiverId: createdMessage!.receiverId,
        mediaType: createdMessage!.mediaType,
        mediaName: createdMessage!.mediaName,
        mediaUrl: createdMessage!.mediaUrl,
        senderId: id,
        timestamp: createdMessage!.timestamp,
        sender: createdMessage.sender,
        groupId: createdMessage.groupId,
        receiver: createdMessage.receiver,
        text,
      }
    });

    io.emit(`${tenantId}:mensagem-chat-interno-notificacao`, {
      action: "update",
      data: {
        id: createdMessage!.id,
        receiverId,
        senderId: id,
        mediaType: createdMessage!.mediaType,
        timestamp: createdMessage!.timestamp,
        sender: createdMessage.sender,
        groupId: createdMessage.groupId,
        receiver: createdMessage.receiver,
        text,
      }
    });

    return res.status(201).json({ mensagem: createdMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao criar a mensagem.' });
  }
};

export const marcarMensagemNaoLida = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { id, tenantId } = req.user;
    const { isGroup } = req.body;

    const io = getIO();

    await ReadMessageService({ userId: id, senderId: contactId, isGroup });

    io.emit(`${tenantId}:unread-mensagem-chat-interno`, {
      action: "update",
      data: {
        receiverId: id,
        isGroup,
        senderId: Number(contactId),
      }
    });

    return res.status(200).json({ message: 'Mensagems marcadas como lida.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao marcar a mensagens como lida.' });
  }
}
export const listCountUnreadMessage = async (req, res) => {
  try {
    const { id } = req.user;
    const count = await ListCountUnreadMessage(id);
    return res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao contar as mensagens não lidas.' });
  }
};

