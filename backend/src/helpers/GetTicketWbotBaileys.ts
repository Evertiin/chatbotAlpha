import { WASocket } from "@whiskeysockets/baileys";
import GetDefaultWhatsApp from "./GetDefaultWhatsApp";
import Ticket from "../models/Ticket";
import { getWbot } from "../libs/wbot-baileys";

type Session = WASocket & {
  id?: number;
};

const GetTicketWbot = async (ticket: Ticket): Promise<Session> => {
  if (!ticket.whatsappId) {
    const defaultWhatsapp = await GetDefaultWhatsApp(ticket.tenantId);

    await ticket.$set("whatsapp", defaultWhatsapp);
  }

  const wbot = getWbot(ticket.whatsappId);

  return wbot;
};

export default GetTicketWbot;