/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Request, Response } from "express";
import AppError from "../errors/AppError";
import DeleteMessageSystem from "../helpers/DeleteMessageSystem";
import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import Message from "../models/Message";
import CreateForwardMessageService from "../services/MessageServices/CreateForwardMessageService";
import CreateMessageSystemService from "../services/MessageServices/CreateMessageSystemService";
import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import { logger } from "../utils/logger";

type IndexQuery = {
  pageNumber: string;
};

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  sendType?: string;
  scheduleDate?: string | Date;
  quotedMsg?: Message;
  idFront?: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber } = req.query as IndexQuery;
  const { tenantId } = req.user;

  const { count, messages, messagesOffLine, ticket, hasMore } =
    await ListMessagesService({
      pageNumber,
      ticketId,
      tenantId
    });

  SetTicketMessagesAsRead(ticket);

  return res.json({ count, messages, messagesOffLine, ticket, hasMore });
};

export const ListCountMensagens = async (req: Request, res: Response): Promise<Response> => {
  try {
    const count = await Message.count();

    return res.json({ count });
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro ao contar as mensagens.' });
  }
};


export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { tenantId, id: userId } = req.user;
  const messageData: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];
  const ticket = await ShowTicketService({ id: ticketId, tenantId });

  try {
    await SetTicketMessagesAsRead(ticket);
  } catch (error) {
    console.log("SetTicketMessagesAsRead", error);
  }

  try {
    if (medias) {
      medias.forEach(async (media, index) => {
        const message: MessageData = {
          fromMe: messageData.fromMe,
          body: Array.isArray(messageData.body) ? messageData.body[index] : messageData.body,
          idFront: Array.isArray(messageData.idFront) ? messageData.idFront[index] : messageData.idFront,
          read: false
        }

        await CreateMessageSystemService({
          msg: message,
          tenantId,
          medias: [media],
          ticket,
          userId,
          scheduleDate: messageData.scheduleDate ? new Date(Array.isArray(messageData.scheduleDate) ? messageData.scheduleDate[index] : messageData.scheduleDate) : undefined,
          sendType: messageData.sendType || "chat",
          status: "pending",
          idFront: Array.isArray(messageData.idFront) ? messageData.idFront[index] : messageData.idFront
        });

      });
    } else {

      await CreateMessageSystemService({
        msg: messageData,
        tenantId,
        medias: medias,
        ticket,
        userId,
        scheduleDate: messageData.scheduleDate,
        sendType: messageData.sendType || "chat",
        status: "pending",
        idFront: messageData.idFront
      });
    }

  } catch (error) {
    console.log("try CreateMessageSystemService", error);
  }

  return res.send();
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;
  const { tenantId } = req.user;
  try {
    await DeleteMessageSystem(req.body.id, messageId, tenantId);
  } catch (error) {
    logger.error(`ERR_DELETE_SYSTEM_MSG: ${error}`);
    throw new AppError("ERR_DELETE_SYSTEM_MSG");
  }

  return res.send();
};

export const forward = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body;
  const { user } = req;


  for (const message of data.messages) {
    await CreateForwardMessageService({
      userId: user.id,
      tenantId: user.tenantId,
      message,
      contact: data.contact,
      ticketIdOrigin: message.ticketId
    });
  }

  return res.send();
};
