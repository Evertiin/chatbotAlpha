import { MinimalMessage, proto, WAMessage, WASocket } from "@whiskeysockets/baileys";
import { cacheLayer } from "../libs/cache";
import { getIO } from "../libs/socket";
import Message from "../models/Message";
import Ticket from "../models/Ticket";
import { logger } from "../utils/logger";
import GetTicketWbot from "./GetTicketWbotBaileys";
import socketEmit from "./socketEmit";


const SetTicketMessagesAsRead = async (ticket: Ticket): Promise<void> => {
  await ticket.update({ unreadMessages: 0 });
  await cacheLayer.set(`contacts:${ticket.contactId}:unreads`, "0");

  try {
    const wbot = await GetTicketWbot(ticket);

    const getJsonMessage = await Message.findAll({
      where: {
        ticketId: ticket.id,
        fromMe: false,
        read: false
      },
      order: [["createdAt", "DESC"]]
    });

    getJsonMessage.forEach(async item => {

      const lastMessages: WAMessage = JSON.parse(
        item.dataJson
      );

      if (lastMessages.key && lastMessages.key.fromMe === false) {
        await wbot.readMessages([lastMessages.key]);
        // await (wbot as WASocket).chatModify(
        //   { markRead: true, lastMessages: [lastMessages] }, `${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`
        // );
      }
    })

    await Message.update(
      { read: true },
      {
        where: {
          ticketId: ticket.id,
          read: false
        }
      }
    );

    socketEmit({
      tenantId: ticket.tenantId,
      type: "ticket:update",
      payload: ticket
    });

  } catch (err) {
    console.log(err);
    logger.warn(
      `Could not mark messages as read. Maybe whatsapp session disconnected? Err: ${err}`
    );
  }



  // const io = getIO();
  // io.to(ticket.status).to("notification").emit(`company-${ticket.tenantId}-ticket`, {
  //   action: "updateUnread",
  //   ticketId: ticket.id
  // });
};

export default SetTicketMessagesAsRead;
