/* eslint-disable @typescript-eslint/no-explicit-any */

import { getWbot } from "../libs/wbot-baileys";
import Message from "../models/Message";
import SendMessagesSystemWbotBaileys from "../services/WbotServices/SendMessagesSystemWbotBaileys";
import { logger } from "../utils/logger";


export const sendMessageBaileys = async (sessionId, tenantId, messages: Message[] | undefined = undefined) => {
  try {
    const wbot = getWbot(sessionId);
    await SendMessagesSystemWbotBaileys(wbot, tenantId, messages);
  } catch (error) {
    logger.error({ message: "Error send messages", error });
    throw new Error(error);
  }
};
