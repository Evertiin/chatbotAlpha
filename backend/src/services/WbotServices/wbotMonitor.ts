import {
  WASocket,
  BinaryNode,
  Contact as BContact,
} from "@whiskeysockets/baileys";
import * as Sentry from "@sentry/node";

import Contact from "../../models/Contact";
import Setting from "../../models/Setting";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";
import createOrUpdateBaileysService from "../BaileysServices/CreateOrUpdateBaileysService";
import CreateMessageService from "../MessageServices/CreateMessageService";
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import Message from "../../models/Message";

type Session = WASocket & {
  id?: number;
};

interface IContact {
  contacts: BContact[];
}

const wbotMonitor = async (
  wbot: Session,
  whatsapp: Whatsapp,
  tenantId: number
): Promise<void> => {
  try {
    wbot.ws.on("CB:call", async (node: BinaryNode) => {
      const content = node.content[0] as any;
      
      if (content.tag === "offer") {
        const sendMsgCall = await Setting.findOne({
          where: { key: "rejectCalls", tenantId },
        });

        if (sendMsgCall.value === "enabled") {
          wbot.rejectCall(content.attrs['call-id'], content.attrs['call-creator']);
        }
      }

      if (content.tag === "terminate") {
        const sendMsgCall = await Setting.findOne({
          where: { key: "rejectCalls", tenantId },
        });

        if (sendMsgCall.value === "enabled") {

          const messageDefault =
            "As chamadas de voz e vídeo estão desabilitas para esse WhatsApp, favor enviar uma mensagem de texto.";

          const callRejectMessage = await Setting.findOne({ where: { key: "callRejectMessage", tenantId } });

          const sendedMessage = await wbot.sendMessage(node.attrs.from, {
            text: callRejectMessage.value || messageDefault
          });

          const number = node.attrs.from.replace(/\D/g, "");

          const contact = await Contact.findOne({
            where: { tenantId, number },
          });

          const ticket = await FindOrCreateTicketService({
            contact,
            whatsappId: wbot.id!,
            unreadMessages: 1,
            tenantId,
            channel: "whatsapp"
          });

          const date = new Date();
          const hours = date.getHours();
          const minutes = date.getMinutes();

          const body = `Chamada de voz/vídeo perdida às ${hours}:${minutes}`;
          const messageData = {
            messageId: sendedMessage.key.id,
            ticketId: ticket.id,
            contactId: contact.id,
            body,
            dataJson: sendedMessage + '',
            fromMe: false,
            mediaType: "call",
            read: true,
            quotedMsgId: null,
            ack: 1,
          };

          await ticket.update({
            lastMessage: body,
          });

          await Message.create({ ...messageData, tenantId });
        }
      }
    });
    wbot.ev.on("contacts.upsert", async (contacts: BContact[]) => {
      await createOrUpdateBaileysService({
        whatsappId: whatsapp.id,
        contacts,
      });
    });

  } catch (err) {
    Sentry.captureException(err);
    logger.error(err);
  }
};

export default wbotMonitor;
