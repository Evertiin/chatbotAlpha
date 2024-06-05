import Whatsapp from "../../models/Whatsapp";
import { wbotMessageListenerBaileys } from "./wbotMessageListener";
import { getIO } from "../../libs/socket";
import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";
import { StartInstaBotSession } from "../InstagramBotServices/StartInstaBotSession";
import { StartTbotSession } from "../TbotServices/StartTbotSession";
import { StartWaba360 } from "../WABA360/StartWaba360";
import { StartMessengerBot } from "../MessengerChannelServices/StartMessengerBot";
import { initWASocket } from "../../libs/wbot-baileys";
import wbotMonitor from "./wbotMonitor";

export const StartWhatsAppSession = async (
  whatsapp: Whatsapp
): Promise<void> => {
  await whatsapp.update({ status: "OPENING" });

  const io = getIO();
  io.emit(`${whatsapp.tenantId}:whatsappSession`, {
    action: "update",
    session: whatsapp
  });

  try {
    if (whatsapp.type === "whatsapp") {
      const wbot = await initWASocket(whatsapp);
      await wbotMessageListenerBaileys(wbot, whatsapp);
      wbotMonitor(wbot, whatsapp, whatsapp.tenantId)
    }

    if (whatsapp.type === "telegram") {
      StartTbotSession(whatsapp);
    }

    if (whatsapp.type === "instagram") {
      StartInstaBotSession(whatsapp);
    }

    if (whatsapp.type === "messenger") {
      StartMessengerBot(whatsapp);
    }

    if (whatsapp.type === "waba") {
      if (whatsapp.wabaBSP === "360") {
        StartWaba360(whatsapp);
      }
    }
  } catch (err) {
    logger.error(`StartWhatsAppSession | Error: ${err}`);
    throw new AppError("ERR_START_SESSION", 404);
  }
};
