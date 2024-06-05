/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from "path";
import { logger } from "../utils/logger";
import CampaignContacts from "../models/CampaignContacts";
import { getWbot } from "../libs/wbot-baileys";
import { proto } from "@whiskeysockets/baileys";
import { getMessageOptions } from "../services/WbotServices/SendMessagesSystemWbotBaileys";


export default {
  key: "SendMessageWhatsappCampaign",
  options: {
    delay: 15000,
    attempts: 2,
    removeOnComplete: true,
    // removeOnFail: true,
    // backoff: {
    //   type: "fixed",
    //   delay: 60000 * 5 // 5 min
    // }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async handle({ data }: any) {
    try {
      /// feito por está apresentando problema com o tipo
      const wbot = getWbot(data.whatsappId);
      let message = {} as proto.WebMessageInfo | undefined;
      const chatId = `${data.number}@s.whatsapp.net`;
      if (data.mediaUrl) {
        const customPath = join(__dirname, "..", "..", "public");
        const mediaPath = join(customPath, data.mediaName);

        const options = await getMessageOptions(
          data.mediaName,
          mediaPath,
          data.message
        );
        if (options) {
          message = await wbot.sendMessage(chatId, {
            ...options
          });
        }
      } else {
        message = await wbot.sendMessage(chatId, { text: data.message });
      }

      await CampaignContacts.update(
        {
          messageId: message?.key.id,
          messageRandom: data.messageRandom,
          body: data.message,
          mediaName: data.mediaName,
          timestamp: message?.messageTimestamp,
          jobId: data.jobId
        },
        { where: { id: data.campaignContact.id } }
      );

      return message;
    } catch (error) {
      logger.error(`Error enviar message campaign: ${error}`);
      throw new Error(error);
    }
  }
};
