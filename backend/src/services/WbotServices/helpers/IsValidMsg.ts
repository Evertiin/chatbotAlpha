import { WAMessage } from "@whiskeysockets/baileys";

export const isValidBaileys = (msg: WAMessage): boolean => {
  if (msg.message?.protocolMessage) return false;
  if (msg.broadcast) return false;
  if (
    msg.message?.extendedTextMessage ||
    msg.message?.conversation ||
    msg.message?.audioMessage ||
    msg.message?.videoMessage ||
    msg.message?.imageMessage ||
    msg.message?.documentMessage ||
    msg.message?.contactMessage ||
    msg.message?.stickerMessage
  )
    return true;
  return false;

};
