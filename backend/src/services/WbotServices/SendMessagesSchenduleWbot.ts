/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Op } from "sequelize";
import Message from "../../models/Message";
import { logger } from "../../utils/logger";
import { getWbot } from "../../libs/wbot-baileys";
import { join } from "path";
import { getMessageOptions } from "./SendMessagesSystemWbotBaileys";
import { sleepRandomTime } from "../../utils/sleepRandomTime";
import Ticket from "../../models/Ticket";

const SendMessagesSchenduleWbot = async (): Promise<void> => {

  const where = {
    fromMe: true,
    messageId: { [Op.is]: null },
    status: "pending",
  };

  const messages = await Message.findAll({
    where,
    include: [
      {
        model: Ticket,
        as: "ticket",
        where: {
          [Op.or]: {
            status: { [Op.ne]: "closed" },
            isFarewellMessage: true
          },
          channel: "whatsapp",
        },
        include: ["contact"]
      }
    ],
    order: [["createdAt", "ASC"]]
  });

  let sendedMessage;

  messages.forEach(async message => {
    if (message.scheduleDate && message.scheduleDate.getTime() <= new Date().getTime()) {
      logger.info(
        `Message Schendule Queue: ${message.id} | Tenant: ${message.tenantId}`
      );
      const wbot = getWbot(message.ticket.whatsappId);
      const contactNumber = message.ticket.contact.number;
      const typeGroup = message.ticket.isGroup ? "g.us" : "s.whatsapp.net";

      const chatId = `${contactNumber}@${typeGroup}`;

      try {
        if (message.mediaType !== "chat" && message.mediaName) {
          const customPath = join(__dirname, "..", "..", "..", "public");
          const mediaPath = join(customPath, message.mediaName);

          const options = await getMessageOptions(
            message.mediaName,
            mediaPath
          );
          if (options) {
            sendedMessage = await wbot.sendMessage(chatId, {
              ...options
            });
          }
          logger.info("sendMessage media Schendule");
        } else {

          sendedMessage = await wbot.sendMessage(chatId, { text: message.body });

          logger.info("sendMessage text Schendule");
        }

        // enviar old_id para substituir no front a mensagem corretamente
        const messageToUpdate = {
          messageId: sendedMessage.key.id,
          status: "sended"
        };

        await Message.update(
          { ...messageToUpdate },
          { where: { id: message.id } }
        );

        logger.info("Message Update Schendule");

        // delay para processamento da mensagem
        await sleepRandomTime({
          minMilliseconds: Number(process.env.MIN_SLEEP_INTERVAL || 500),
          maxMilliseconds: Number(process.env.MAX_SLEEP_INTERVAL || 2000)
        });

        logger.info("sendMessage Schendule");
      } catch (error) {
        const idMessage = message.id;
        const ticketId = message.ticketId;

        if (error.code === "ENOENT") {
          await Message.destroy({
            where: { id: message.id }
          });
        }

        logger.error(
          `Error message is (tenant: ${message.tenantId} | Ticket: ${ticketId})`
        );
        logger.error(`Error send message (id: ${idMessage})::${error}`);
      }
    }
  })
};

export default SendMessagesSchenduleWbot;
