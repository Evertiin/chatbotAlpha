import { WASocket } from "@whiskeysockets/baileys";
import AppError from "../../errors/AppError";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import GetTicketWbot from "../../helpers/GetTicketWbotBaileys";
import GetWbotMessage from "../../helpers/GetWbotMessageBaileys";


const DeleteWhatsAppMessage = async (messageId: string): Promise<Message> => {

  const message = await Message.findOne({
    where: { id: messageId },
    include: [
      {
        model: Ticket,
        as: "ticket",
        include: ["contact"]
      }
    ]
  });

  if (!message) {
    throw new AppError("No message found with this ID.");
  }

  const { ticket } = message;

  const messageToDelete = await GetWbotMessage(ticket, messageId);

  try {
    const wbot = await GetTicketWbot(ticket);
    const menssageDelete = messageToDelete as Message;

    const jsonStringToParse = JSON.parse(menssageDelete.dataJson)

    await (wbot as WASocket).sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
      delete: jsonStringToParse.key
    })

  } catch (err) {
    console.log(err);
    throw new AppError("ERR_DELETE_WAPP_MSG");
  }
  await message.update({ isDeleted: true });

  return message;
};

export default DeleteWhatsAppMessage;