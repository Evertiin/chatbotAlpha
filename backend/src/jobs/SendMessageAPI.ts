import Queue from "../libs/Queue";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";
import CreateMessageSystemService from "../services/MessageServices/CreateMessageSystemService";
import { getWbot } from "../libs/wbot-baileys";
import Contact from "../models/Contact";
import CreateContactService from './../services/ContactServices/CreateContactService';
import AppError from "../errors/AppError";

export default {
  key: "SendMessageAPI",
  options: {
    delay: 500,
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: false,
    // backoff: {
    //   type: "fixed",
    //   delay: 5000 // 3 min
    // }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async handle({ data }: any) {

    const wbot = getWbot(data.sessionId);

    try {
      const chatId = `${data.number}@$s.whatsapp.net`;

      const jid = await wbot.onWhatsApp(chatId);

      if (jid[0].exists == false) {
        throw new AppError("NUMBER_NOT_FOUND", 404)
      }

      data.number = jid[0].jid.split('@')[0]

      let contact = await Contact.findOne({ where: { number: data.number, tenantId: data.tenantId } })

      if (!contact) {
        contact = await CreateContactService({ name: data.number, number: data.number, tenantId: data.tenantId })
      }

      const ticket = await FindOrCreateTicketService({
        contact,
        whatsappId: wbot.id!,
        unreadMessages: 0,
        tenantId: data.tenantId,
        groupContact: undefined,
        channel: "whatsapp"
      });

      await CreateMessageSystemService({
        msg: data,
        tenantId: data.tenantId,
        ticket,
        sendType: "API",
        status: "pending"
      });

      await ticket.update({
        apiConfig: {
          ...data.apiConfig,
          externalKey: data.externalKey
        }
      });
    } catch (error) {

      const payload = {
        ack: -2,
        body: data.body,
        messageId: "",
        number: data.number,
        externalKey: data.externalKey,
        error: "error session",
        type: "hookMessageStatus",
        authToken: data.authToken
      };

      if (data?.apiConfig?.urlMessageStatus) {
        Queue.add("WebHooksAPI", {
          url: data.apiConfig.urlMessageStatus,
          type: payload.type,
          payload
        });
      }
      throw new Error(error);
    }
  }
};
