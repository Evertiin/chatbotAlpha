/* eslint-disable @typescript-eslint/no-explicit-any */
import { getWbot } from "../libs/wbot-baileys";
import { logger } from "../utils/logger";
// import { getWbot } from "../libs/wbot";

export default {
  key: "SendMessageWhatsappBusinessHours",
  options: {
    delay: 500,
    attempts: 50,
    removeOnComplete: true,
    removeOnFail: false,
    // backoff: {
    //   type: "fixed",
    //   delay: 5000 // 3 min
    // }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async handle({ data }: any) {
    try {
      const wbot = getWbot(data.ticket.whatsappId);
      const typeGroup = data.ticket?.isGroup ? "g.us" : "s.whatsapp.net";
      const chatId = `${data.ticket.contact.number}@${typeGroup}`;
      const message = await wbot.sendMessage(chatId, { text: data.tenant.messageBusinessHours });

      // const message = await wbot.sendMessage(
      //   `${data.ticket.contact.number}@c.us`,
      //   data.tenant.messageBusinessHours,
      //   {
      //     linkPreview: false
      //   }
      // );

      const result = {
        message,
        messageBusinessHours: data.tenant.messageBusinessHours,
        ticket: data.ticket
      };

      return result;
    } catch (error) {
      logger.error(`Error enviar message business hours: ${error}`);
      throw new Error(error);
    }
  }
};
