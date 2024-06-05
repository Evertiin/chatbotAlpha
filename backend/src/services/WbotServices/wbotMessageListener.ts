
import { getContentType, GroupMetadata, MessageUpsertType, proto, WAMessage, WAMessageStubType, WAMessageUpdate, WASocket } from "@whiskeysockets/baileys";
import Message from "../../models/Message";
import * as Sentry from "@sentry/node";
import { logger } from "../../utils/logger";
import Ticket from "../../models/Ticket";
import { isValidBaileys } from "./helpers/IsValidMsg";
import Whatsapp from "../../models/Whatsapp";
import ShowWhatsAppService from "../WhatsappService/ShowWhatsAppService";
import Setting from "../../models/Setting";
import Contact from './../../models/Contact';
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import { VerifyContactBaileys, VerifyMessageBaileys, VerifyMediaMessageBaileys, getBodyMessage } from "./helpers/VerifyContactBaileys";
import Queue from "../../libs/Queue";
import verifyBusinessHours from "./helpers/VerifyBusinessHours";
import VerifyStepsChatFlowTicket from "../ChatFlowServices/VerifyStepsChatFlowTicket";
import socketEmit from "../../helpers/socketEmit";
import sequelize from './../../database/index';
import { QueryTypes } from "sequelize";
import CampaignContacts from "../../models/CampaignContacts";
import { cacheLayer } from "../../libs/cache";
import whatsapp from './../../../../frontend/src/store/modules/whatsapp';
import GetQueueService from "../QueueServices/GetQueueService";
import VerifyMensageOpenIAQueue from "../OpenIA/VerifyMensageOpenIAQueue";
import { number } from 'yup';

// Baileys
type SessionWA = WASocket & {
  id?: number;
};

interface ImessageUpsert {
  messages: proto.IWebMessageInfo[];
  type: MessageUpsertType;
}
// Naileys

const messageQueue = [];

const filterMessages = (msg: WAMessage): boolean => {
  if (msg.message?.protocolMessage) return false;
  if (
    [
      WAMessageStubType.REVOKE,
      WAMessageStubType.E2E_DEVICE_CHANGED,
      WAMessageStubType.E2E_IDENTITY_CHANGED,
      WAMessageStubType.CIPHERTEXT
    ].includes(msg.messageStubType as WAMessageStubType)
  )
    return false;

  return true;
};

const wbotMessageListenerBaileys = async (wbot: SessionWA, whatsapp: Whatsapp) => {
  try {
    wbot.ev.on("messages.upsert", async (messageUpsert: ImessageUpsert) => {

      console.log(`Mensagem recebida. - WhatsApp: ${whatsapp.name}`);
      const messages = messageUpsert.messages
        .filter(filterMessages)
        .map(msg => msg);

      if (!messages) return;

      for (let message of messages) {
        const number = message.key.remoteJid.split("@")[0]

        // Query para ele não abrir o ticket com a mensagem de encerramento
        const query = `select t.id, t."lastMessage", c."number"
                from "Tickets" t, 
                "Contacts" c 
                where t."tenantId" = ${whatsapp.tenantId}
                and c."number" = '${number}'
                and c."tenantId" = ${whatsapp.tenantId}
                and t."contactId" = c.id
                and t.id = (select max(id) from "Tickets" where t."tenantId" = ${whatsapp.tenantId} and c."number" = '${number}' and c."tenantId" = ${whatsapp.tenantId})`;

        const resultData: any = await sequelize?.query(query, {
          type: QueryTypes.SELECT,
          nest: true
        });

        if (resultData.length > 0 && message.key.fromMe && resultData[0]["lastMessage"] === whatsapp.farewellMessage) {
          return;
        }

        const campanha = await CampaignContacts.count({ where: { messageId: message.key.id } });

        if (campanha > 0) {
          return;
        }

        const messageExists = await Message.count({
          where: { messageId: message.key.id, tenantId: whatsapp.tenantId }
        });

        if (!messageExists) {

          const body = await getBodyMessage(message);

          const isCampaign = /\u200c/.test(body!);

          if (!isCampaign) {
            await handleMessageBaileys(wbot, message, whatsapp.id);
          }

        } else if (message.key.fromMe) {
          await Message.update({ dataJson: JSON.stringify(message) }, { where: { messageId: message.key.id, tenantId: whatsapp.tenantId } });
        }
      }

    });

    wbot.ev.on("messages.update", (messageUpdate: WAMessageUpdate[]) => {
      if (messageUpdate.length === 0) return;
      messageUpdate.forEach(async (message: WAMessageUpdate) => {
        let ack: any;
        if (message.update.status === 3 && message?.key?.fromMe) {
          ack = 2;
        } else {
          ack = message.update.status;
        }

        handleMsgAckBaileys(message, ack);
      });
    });


    wbot.ev.on('message-receipt.update', (events: any) => {
      events.forEach(async (msg: any) => {
        const ack = msg?.receipt?.receiptTimestamp ? 3 :
          msg?.receipt?.readTimestamp ? 4 : 0;
        if (!ack) return;
        await handleMsgAckBaileys(msg, ack);
      });
    })


  } catch (error) {
    Sentry.captureException(error);
    logger.error(`Error handling wbot message listener. Err: ${error}`);
  }
};

const handleReceiveMessages = async () => {

  while (messageQueue.length > 0) {

    const { message, wbot, whatsapp } = messageQueue[0];


    messageQueue.shift();
  }
}

const handleMsgAckBaileys = async (
  msg: WAMessage,
  chat: number | null | undefined
) => {
  await new Promise((r) => setTimeout(r, 500));

  try {
    const messageToUpdate = await Message.findOne({
      where: {
        messageId: String(msg.key.id),
      },
      include: [
        "contact",
        {
          model: Ticket,
          as: "ticket",
        },
        {
          model: Message,
          as: "quotedMsg",
          include: ["contact"],
        },
      ],
    });
    if (!messageToUpdate) {
      const campaing = await CampaignContacts.findOne({ where: { messageId: String(msg.key.id) } })
      if (!campaing) {
        return;
      }

      await campaing.update({ ack: chat });

      return;

    }
    await messageToUpdate.update({ ack: chat });

    socketEmit({
      tenantId: messageToUpdate.tenantId,
      type: "chat:ack",
      payload: messageToUpdate
    });

  } catch (err) {
    Sentry.captureException(err);
    logger.error(`Error handling message ack. Err: ${err}`);
  }
};

const handleMessageBaileys = async (wbot: SessionWA, msg: WAMessage, whatsAppId: number) => {

  if (!isValidBaileys(msg)) {
    return;
  }

  const whatsapp = await ShowWhatsAppService({ id: whatsAppId });

  const { tenantId, isDeleted } = whatsapp;

  // valida se o whatsapp está deletado
  if (isDeleted) {
    return;
  }

  // const chat = await msg.getChat();
  // IGNORAR MENSAGENS DE GRUPO
  const Settingdb = await Setting.findOne({
    where: { key: "ignoreGroupMsg", tenantId }
  });

  if (
    Settingdb?.value === "enabled" &&
    (isGroup(msg) || msg.broadcast)
  ) {
    return;
  }
  // IGNORAR MENSAGENS DE GRUPO

  try {

    let groupContact: Contact | undefined;

    let ppUrl;
    let contact;

    if (!msg.key.fromMe) {
      try {
        ppUrl = await wbot.profilePictureUrl(msg.key.remoteJid!, "image", 30000)
      } catch (e) {
        ppUrl = null;
      }
    }

    let group = {} as GroupMetadata;

    if (isGroup(msg)) {
      group = await wbot.groupMetadata(msg.key.remoteJid);
      groupContact = await VerifyContactBaileys(msg, tenantId, ppUrl!, true, group);
    }

    if (!msg.key.fromMe) {
      try {
        if (msg.key.participant) {
          ppUrl = await wbot.profilePictureUrl(msg.key.participant!, "image", 30000)
        } else {
          ppUrl = await wbot.profilePictureUrl(msg.key.remoteJid!, "image", 30000)
        }
      } catch (e) {
        ppUrl = null;
      }
    }

    contact = await VerifyContactBaileys(msg, tenantId, ppUrl!, false, group);

    let unreadMessages = 0;

    if (msg.key.fromMe) {
      await cacheLayer.set(`contacts:${contact.id}:unreads`, "0");
    } else {
      const unreads = await cacheLayer.get(`contacts:${contact.id}:unreads`);
      unreadMessages = +unreads + 1;
      await cacheLayer.set(
        `contacts:${contact.id}:unreads`,
        `${unreadMessages}`
      );
    }

    const ticket = await FindOrCreateTicketService({
      contact,
      whatsappId: whatsAppId,
      unreadMessages,
      tenantId,
      groupContact,
      msg,
      channel: "whatsapp"
    });

    if (ticket?.isCampaignMessage) {
      return;
    }

    if (ticket?.isFarewellMessage) {
      return;
    }

    if (msg.message?.imageMessage ||
      msg.message?.audioMessage ||
      msg.message?.videoMessage ||
      msg.message?.stickerMessage ||
      msg.message?.documentMessage ||
      msg.message?.documentWithCaptionMessage?.message?.documentMessage ||
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage) {
      await VerifyMediaMessageBaileys(msg, ticket, contact);
    } else {
      await VerifyMessageBaileys(msg, msg.key.fromMe!, ticket, contact);
    }

    const isBusinessHours = await verifyBusinessHours(msg, ticket);

    if (isBusinessHours) await VerifyStepsChatFlowTicket(msg, ticket);

    if (isBusinessHours && ticket.queueId && ticket.is_chat_ia) {
      const queue = await GetQueueService(ticket.queueId)
      await VerifyMensageOpenIAQueue(ticket, queue, false, true, msg.key, msg);
    }



    const apiConfig: any = ticket.apiConfig || {};
    if (
      !msg.key.fromMe &&
      !ticket.isGroup &&
      !ticket.answered &&
      apiConfig?.externalKey &&
      apiConfig?.urlMessageStatus
    ) {
      const payload = {
        timestamp: Date.now(),
        msg,
        messageId: msg.key.id,
        ticketId: ticket.id,
        externalKey: apiConfig?.externalKey,
        authToken: apiConfig?.authToken,
        type: "hookMessage"
      };
      Queue.add("WebHooksAPI", {
        url: apiConfig.urlMessageStatus,
        type: payload.type,
        payload
      });
    }
  } catch (err) {
    logger.error(err);
  }
}

const isGroup = (msg: WAMessage): boolean => {
  return msg.key.remoteJid?.indexOf("@g.us")! > 0
}

export { wbotMessageListenerBaileys };
