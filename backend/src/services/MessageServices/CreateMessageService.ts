import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import socketEmit from "../../helpers/socketEmit";
import Contact from "../../models/Contact";

interface MessageData {
  id?: string;
  messageId: string;
  ticketId: number;
  body: string;
  contactId?: number;
  fromMe?: boolean;
  read?: boolean;
  mediaType?: string;
  mediaUrl?: string;
  timestamp?: number;
}
interface Request {
  messageData: MessageData;
  tenantId: string | number;
}

const CreateMessageService = async ({
  messageData,
  tenantId
}: Request): Promise<Message> => {

  const msg = await Message.findOne({
    where: { messageId: messageData.messageId, tenantId }
  });

  if (!msg) {
    await Message.create({ ...messageData, tenantId });
  } else {
    await msg.update(messageData);
  }

  let includes;

  if (!messageData.fromMe) {
    includes = [{
      model: Ticket,
      as: "ticket",
      where: { tenantId },
      include: ["contact"]
    },
    {
      model: Message,
      as: "quotedMsg",
      include: ["contact"]
    },
    {
      model: Contact,
      as: "contact",
      where: { id: messageData.contactId }
    }];
  } else {
    includes = [{
      model: Ticket,
      as: "ticket",
      where: { tenantId },
      include: ["contact"]
    },
    {
      model: Message,
      as: "quotedMsg",
      include: ["contact"]
    }];
  }

  const message = await Message.findOne({
    where: { messageId: messageData.messageId, tenantId },
    include: includes
  });

  if (!message) {
    // throw new AppError("ERR_CREATING_MESSAGE", 501);
    throw new Error("ERR_CREATING_MESSAGE");
  }

  socketEmit({
    tenantId,
    type: "chat:create",
    payload: message
  });

  return message;
};

export default CreateMessageService;
