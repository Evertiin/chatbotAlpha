import Contact from "../../../models/Contact";
import CreateOrUpdateContactService from "../../ContactServices/CreateOrUpdateContactService";
import { GroupMetadata, MediaType, WAMessage, downloadContentFromMessage, extractMessageContent, getContentType, proto } from "@whiskeysockets/baileys";
import Ticket from "../../../models/Ticket";
import CreateMessageService from "../../MessageServices/CreateMessageService";
import { promisify } from "util";
import { writeFile } from "fs";
import { join } from "path";
import { logger } from "../../../utils/logger";
import Message from "../../../models/Message";

const writeFileAsync = promisify(writeFile);

export const VerifyContactBaileys = async (
  message: WAMessage,
  tenantId: string | number,
  profileUrl: string,
  isGroup: boolean = false,
  group: GroupMetadata | undefined = undefined
): Promise<Contact> => {

  let name = ""
  let number = ""
  let pushname = ""

  if (isGroup) {
    name = group.subject;
    pushname = group.subject;
    number = group.id.split('@')[0]!;
  } else {
    if (message.key.participant) {
      number = message.key.participant?.split('@')[0]!;
    } else {
      number = message.key.remoteJid?.split('@')[0]!;
    }

    if (message.key.fromMe) {
      name = number;
      pushname = number;
    } else {
      name = message.pushName!;
      pushname = message.pushName!;
    }

  }

  const contactData = {
    name,
    number,
    profilePicUrl: profileUrl,
    tenantId: Number(tenantId),
    pushname,
    isUser: false,
    isWAContact: false,
    isGroup
  };

  const contact = await CreateOrUpdateContactService(contactData);

  return contact;
};

export const VerifyMessageBaileys = async (
  ctx: WAMessage,
  fromMe: boolean,
  ticket: Ticket,
  contact: Contact
): Promise<void> => {

  const quotedMsg = await verifyQuotedMessage(ctx);

  const body = await getBodyMessage(ctx)

  const messageData = {
    messageId: String(ctx.key.id),
    ticketId: ticket.id,
    contactId: fromMe ? undefined : contact.id,
    body: String(body),
    fromMe,
    read: fromMe,
    mediaType: getTypeMessage(ctx),
    quotedMsgId: quotedMsg?.id,
    timestamp: new Date().getTime(), // Math.trunc(ctx.message.timestamp / 1000),
    status: "received",
    dataJson: JSON.stringify(ctx),
  };

  await ticket.update({
    lastMessage: String(body),
    lastMessageAt: new Date().getTime(),
    answered: fromMe || false
  });
  await CreateMessageService({
    messageData,
    tenantId: ticket.tenantId
  });
};


export const VerifyMediaMessageBaileys = async (
  msg: WAMessage,
  ticket: Ticket,
  contact: Contact
): Promise<void> => {

  const quotedMsg = await verifyQuotedMessage(msg);

  try {

    const media = await downloadMedia(msg);

    if (media.data === "error") {
      throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }

    if (!media) {
      throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }

    if (!media.filename) {
      const ext = media!.mimetype!.split("/")[1].split(";")[0];
      media.filename = `${new Date().getTime()}.${ext}`;
    } else {
      // ext = tudo depois do ultimo .
      const ext = media.filename.split(".").pop();
      // name = tudo antes do ultimo .
      const name = media.filename.split(".").slice(0, -1).join(".").replace(/\s/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      media.filename = `${name.trim()}_${new Date().getTime()}.${ext}`;
    }

    try {
      await writeFileAsync(
        join(__dirname, "..", "..", "..", "..", "public", media.filename),
        media.data,
        "base64"
      );
    } catch (err) {
      logger.error(err);
    }

    const body = await getBodyMessage(msg);
    const messageData = {
      messageId: String(msg.key.id),
      ticketId: ticket.id,
      contactId: msg.key.fromMe ? undefined : contact.id,
      body: body || media.filename,
      fromMe: !!msg.key.fromMe,
      read: !!msg.key.fromMe,
      quotedMsgId: quotedMsg?.id,
      mediaUrl: media.filename,
      dataJson: JSON.stringify(msg),
      mediaType: media!.mimetype!.split("/")[0]
    };

    await ticket.update({
      lastMessage: body || media.filename,
    });

    await CreateMessageService({
      messageData,
      tenantId: ticket.tenantId,
    });
  } catch (err) {
    logger.error(err);
  }

};

export const verifyQuotedMessage = async (msg: proto.IWebMessageInfo): Promise<Message | null> => {

  if (!msg) return null;

  const quoted = getQuotedMessageId(msg);

  if (!quoted) return null;

  const quotedMsg = await Message.findOne({
    where: { messageId: quoted },
  });

  if (!quotedMsg) return null;

  return quotedMsg;
};

const downloadMedia = async (msg: proto.IWebMessageInfo) => {
  const mineType =
    msg.message?.imageMessage ||
    msg.message?.audioMessage ||
    msg.message?.videoMessage ||
    msg.message?.stickerMessage ||
    msg.message?.documentMessage ||
    msg.message?.documentWithCaptionMessage?.message?.documentMessage ||
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;


  let messageType = mineType!.mimetype!
    .split("/")[0]
    .replace("application", "document")
    ? (mineType!.mimetype!
      .split("/")[0]
      .replace("application", "document") as MediaType)
    : (mineType!.mimetype!.split("/")[0] as MediaType);

  let stream;
  let contDownload = 0;

  if (msg.message?.documentMessage || msg.message?.documentWithCaptionMessage) {
    messageType = "document";
  }

  while (contDownload < 10 && !stream) {
    try {
      contDownload > 1
        ? logger.warn(`Tentativa ${contDownload} de baixar o arquivo`)
        : "";

      stream = await downloadContentFromMessage(
        msg.message?.audioMessage! ||
        msg.message?.videoMessage! ||
        msg.message?.documentMessage! ||
        msg.message?.documentWithCaptionMessage?.message?.documentMessage ||
        msg.message?.imageMessage! ||
        msg.message?.stickerMessage! ||
        msg.message?.extendedTextMessage?.contextInfo!.quotedMessage?.imageMessage ||
        msg.message?.extendedTextMessage?.contextInfo!.quotedMessage?.videoMessage ||
        msg.message?.buttonsMessage?.imageMessage ||
        msg.message?.templateMessage?.fourRowTemplate?.imageMessage ||
        msg.message?.templateMessage?.hydratedTemplate?.imageMessage ||
        msg.message?.templateMessage?.hydratedFourRowTemplate?.imageMessage ||
        msg.message?.interactiveMessage?.header?.imageMessage,
        messageType
      );
    } catch (error) {
      contDownload++;
      await new Promise(resolve =>
        setTimeout(resolve, 1000 * contDownload * 2)
      );
      logger.warn(`>>>> erro ${contDownload} de baixar o arquivo`);
    }
  }

  let buffer = Buffer.from([]);
  // eslint-disable-next-line no-restricted-syntax
  try {
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
  } catch (error) {
    return { data: "error", mimetype: "", filename: "" };
  }

  if (!buffer) {
    throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
  }
  let filename = msg.message?.documentMessage?.fileName || "";

  if (!filename) {
    const ext = mineType!.mimetype!.split("/")[1].split(";")[0];
    filename = `${new Date().getTime()}.${ext}`;
  } else {
    filename = `${new Date().getTime()}_${filename}`;
  }

  const media = {
    data: buffer,
    mimetype: mineType!.mimetype,
    filename
  };
  return media;
};


export const getBodyMessage = async (msg: proto.IWebMessageInfo): Promise<string | undefined> => {

  let bodyMessage;
  try {
    if (msg?.message?.buttonsMessage?.contentText) {
      bodyMessage = `*${msg?.message?.buttonsMessage?.contentText}*`;
      for (const buton of msg.message?.buttonsMessage?.buttons!) {
        bodyMessage += `\n\n${buton!.buttonText!.displayText}`;
      }
      return bodyMessage;
    } else
      if (msg?.message?.listMessage) {
        bodyMessage = `*${msg?.message?.listMessage?.description}*`;
        for (const buton of msg.message?.listMessage?.sections![0]?.rows!) {
          bodyMessage += `\n\n${buton.title}`;
        }
        return bodyMessage;

      }
    if (msg.message?.viewOnceMessage?.message?.listMessage) {

      let obj = msg.message?.viewOnceMessage?.message.listMessage;
      bodyMessage = `*${obj.description}*`;
      for (const buton of obj?.sections![0]?.rows!) {
        bodyMessage += `\n\n${buton.title}`;
      }

      return bodyMessage;
    }
    if (msg.message?.viewOnceMessage?.message?.buttonsMessage) {

      let obj = msg.message?.viewOnceMessage?.message.buttonsMessage;
      bodyMessage = `*${obj.contentText}*`;
      for (const buton of obj?.buttons!) {
        bodyMessage += `\n\n${buton!.buttonText!.displayText}`;
      }
      return bodyMessage;

    }
  } catch (error) {
    logger.error(error);
  }

  try {
    const type = getTypeMessage(msg);

    if (!type) {
      return;
    }

    const types = {
      "conversation": msg!.message!.conversation,
      "imageMessage": msg!.message!.imageMessage?.caption || "image",
      "videoMessage": msg!.message!.videoMessage?.caption || "video",
      "extendedTextMessage": bodyMessage || msg!.message!.extendedTextMessage?.text || msg.message?.listMessage?.description,
      "buttonsResponseMessage": msg.message!.buttonsResponseMessage?.selectedDisplayText,
      "listResponseMessage": msg?.message?.listResponseMessage?.title || "Chegou Aqui",
      "templateButtonReplyMessage": msg.message?.templateButtonReplyMessage?.selectedId,
      "messageContextInfo": msg.message!.buttonsResponseMessage?.selectedButtonId ||
        msg.message!.listResponseMessage?.title,
      "buttonsMessage": bodyMessage || msg.message!.listResponseMessage?.title,
      "stickerMessage": "sticker",
      "contactMessage": msg.message!.contactMessage?.vcard,
      "contactsArrayMessage": "varios contatos",
      "locationMessage": `Latitude: ${msg.message!.locationMessage?.degreesLatitude} - Longitude: ${msg.message!.locationMessage?.degreesLongitude}`,
      "liveLocationMessage": `Latitude: ${msg.message!.liveLocationMessage?.degreesLatitude} - Longitude: ${msg.message!.liveLocationMessage?.degreesLongitude}`,
      "documentMessage": msg.message!.documentMessage?.title,
      "audioMessage": "Áudio",
      "reactionMessage": msg.message?.reactionMessage?.text,
      "ephemeralMessage": msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text,
      "protocolMessage": msg.message?.protocolMessage?.type || msg.message?.ephemeralMessage?.message?.protocolMessage?.type,
      "listMessage": bodyMessage || msg.message?.listMessage?.description,
      "viewOnceMessage": bodyMessage,
      "documentWithCaptionMessage": msg.message?.documentWithCaptionMessage?.message?.documentMessage?.caption,

    }

    const objKey = Object.keys(types).find(objKey => objKey === type);

    if (!objKey) {
      logger.warn(`#### Nao achou o type em getBodyMessage: ${type} - ${JSON.stringify(msg?.message)}`);
    }
    return types[type];

  } catch (error) {
    console.log('Get Body Message --> ' + error);

  }
};

const getTypeMessage = (msg: proto.IWebMessageInfo): string | undefined => {
  try {
    // verificar se o type é um viewOnceMessage
    let type = getContentType(msg?.message!)

    if (type === "viewOnceMessage") {
      // verificar se msg.message tem listMessage ou buttonMessage
      if (msg?.message?.viewOnceMessage?.message?.listMessage) {
        type = "listMessage"
      }
      if (msg?.message?.viewOnceMessage?.message?.buttonsMessage) {
        type = "buttonsMessage"
      }
      if (msg?.message?.viewOnceMessage?.message) {
        type = getContentType(msg?.message?.viewOnceMessage?.message)
      }
    }

    if (type === "ephemeralMessage") {
      // verificar se msg.message tem listMessage ou buttonMessage
      if (msg?.message?.ephemeralMessage?.message?.listMessage) {
        type = "listMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.buttonsMessage) {
        type = "buttonsMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.imageMessage) {
        type = "imageMessage"
      }

      if (msg?.message?.ephemeralMessage?.message?.audioMessage) {
        type = "audioMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.audioMessage) {
        type = "videoMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.documentMessage) {
        type = "documentMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.stickerMessage) {
        type = "stickerMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.contactMessage) {
        type = "contactMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.locationMessage) {
        type = "locationMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.protocolMessage) {
        type = "protocolMessage"
      }
      if (msg?.message?.ephemeralMessage?.message?.viewOnceMessage) {
        type = getContentType(msg?.message?.ephemeralMessage?.message?.viewOnceMessage?.message!)
      }
    }
    return type
  } catch (error) {
    logger.error('Get Type Message -> ' + error);
  }
};

export const getQuotedMessageId = (msg: proto.IWebMessageInfo) => {
  const body = extractMessageContent(msg.message)![
    Object.keys(msg?.message!).values().next().value
  ];
  let reaction = msg?.message?.reactionMessage ? msg?.message?.reactionMessage?.key?.id : "";

  return reaction ? reaction : body?.contextInfo?.stanzaId;
};