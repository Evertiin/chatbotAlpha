/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import path, { join } from "path";
import { Op } from "sequelize";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import { logger } from "../../utils/logger";
import fs from "fs";
import mime from "mime-types";
import { exec } from "child_process";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { AnyMessageContent, WASocket } from "@whiskeysockets/baileys"
import SetTicketMessagesAsRead from "../../helpers/SetTicketMessagesAsRead";

type Session = WASocket & {
  id?: number;
};

const publicFolder = path.resolve(__dirname, "..", "..", "..", "public");

const SendMessagesSystemWbotBaileys = async (
  wbot: Session,
  tenantId: number | string,
  messagesToSend: Message[] | undefined = undefined
) => {

  let messages;

  if (!messagesToSend) {
    const where = {
      fromMe: true,
      messageId: { [Op.is]: null },
      status: "pending",
      [Op.or]: [
        {
          scheduleDate: {
            [Op.lte]: new Date()
          }
        },
        {
          scheduleDate: { [Op.is]: null }
        }
      ]
    };

    messages = await Message.findAll({
      where,
      include: [
        {
          model: Ticket,
          as: "ticket",
          where: {
            tenantId,
            [Op.or]: {
              status: { [Op.ne]: "closed" },
              isFarewellMessage: true
            },
            channel: "whatsapp",
            whatsappId: wbot.id
          },
          include: ["contact"]
        }
      ],
      order: [["createdAt", "ASC"]],
    });

  } else {
    messages = messagesToSend;
  }

  let sendedMessage;

  for (const message of messages) {
    
    let quotedMsg: Message = {} as Message;
    const { ticket } = message;
    const contactNumber = ticket.contact.number;
    const typeGroup = ticket?.isGroup ? "g.us" : "s.whatsapp.net";

    const chatId = `${contactNumber}@${typeGroup}`;
    if (message.quotedMsgId) {

      const quotedMessage = await Message.findOne({ where: { id: message.quotedMsgId } })
      quotedMsg = quotedMessage!;
    }

    try {
      if (message.mediaType !== "chat" && message.mediaName) {
        const customPath = await join(__dirname, "..", "..", "..", "public");
        const mediaPath = join(customPath, message.mediaName);
        console.log('mediaPath: ', mediaPath);

        let mediaConverted;
        if (mediaPath.endsWith('.ogg')) {
          mediaConverted = await processAudio(mediaPath);
        }
        const options = await getMessageOptions(
          message.mediaName,
          mediaConverted || mediaPath  // Use mediaConverted se estiver definido, senão, use mediaPath diretamente
        );

        if (options) {
          sendedMessage = await wbot.sendMessage(chatId, {
            ...options
          });
        }
        logger.info("sendMessage media");
      } else {
        if (quotedMsg.id) {

          let options = {
            quoted: {
              key: {
                remoteJid: chatId,
                id: quotedMsg.messageId,
              },
              message: {
                extendedTextMessage: { text: quotedMsg.body }
              }
            }
          }
          sendedMessage = await wbot.sendMessage(chatId, { text: message.body }, { ...options });
        } else {
          sendedMessage = await wbot.sendMessage(chatId, { text: message.body });
        }

        logger.info("sendMessage text");
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

      logger.info("Message Update");
      await SetTicketMessagesAsRead(ticket);

      // delay para processamento da mensagem
      logger.info("Mensagem Enviada");
    } catch (error) {
      const idMessage = message.id;
      const ticketId = message.ticket.id;

      if (error.code === "ENOENT") {
        await Message.destroy({
          where: { id: message.id }
        });
      }

      logger.error(
        `Error message is (tenant: ${tenantId} | Ticket: ${ticketId})`
      );
      logger.error(`Error send message (id: ${idMessage})::${error}`);
    }
  }
};

export const getMessageOptions = async (
  fileName: string,
  pathMedia: string,
  caption?: string,
): Promise<any> => {
  const mimeType = mime.lookup(pathMedia);
  const typeMessage = String(mimeType).split("/")[0];
  try {
    if (!mimeType) {
      throw new Error("Invalid mimetype");
    }
    let options: AnyMessageContent;

    if (typeMessage === "video") {
      options = {
        video: fs.readFileSync(pathMedia),
        caption: caption ? caption : fileName,
        fileName: fileName
        // gifPlayback: true
      };
    } else if (typeMessage === "audio") {
      const typeAudio = fileName.includes("audio-record-site");
      const convert = await processAudio(pathMedia);
      if (typeAudio) {
        options = {
          audio: fs.readFileSync(convert),
          mimetype: typeAudio ? "audio/mp4" : mimeType,
          ptt: true
        };
      } else {
        options = {
          audio: fs.readFileSync(convert),
          mimetype: typeAudio ? "audio/mp4" : mimeType,
          ptt: true
        };
      }
    } else if (typeMessage === "document") {
      options = {
        document: fs.readFileSync(pathMedia),
        caption: caption ? caption : fileName,
        fileName: fileName,
        mimetype: mimeType
      };
    } else if (typeMessage === "application") {
      options = {
        document: fs.readFileSync(pathMedia),
        caption: caption ? caption : fileName,
        fileName: fileName,
        mimetype: mimeType
      };
    } else {
      options = {
        image: fs.readFileSync(pathMedia),
        caption: caption ? caption : fileName
      };
    }
    return options;
  } catch (e) {
    logger.error(e)
    return null;
  }
};

const processAudio = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ab 128k -ar 44100 -f ipod ${outputAudio} -y`,
      (error, _stdout, _stderr) => {
        if (error) {
          console.log('Falha ao converter o áudio', error)
          reject(error);
        }
        // fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};


export default SendMessagesSystemWbotBaileys;
