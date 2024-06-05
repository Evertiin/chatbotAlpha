import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import { sendMessageToIA } from "../../restClients/openIARestClient";
import CreateMessageSystemService from "../MessageServices/CreateMessageSystemService";
import Whatsapp from "../../models/Whatsapp";
import UpdateQueueIATicket from "../TicketServices/UpdateQueueIATicket";
import Queue from "../../models/Queue";
import ContactWallet from "../../models/ContactWallet";
import { WAMessage } from "@whiskeysockets/baileys";
import { getBodyMessage } from "../WbotServices/helpers/VerifyContactBaileys";
import OpenAI, { ClientOptions } from "openai";
import Tenant from "../../models/Tenant";
import { ChatCompletion } from "openai/resources";

const VerifyMensageOpenIAQueue = async (
    ticket: Ticket,
    queue: Queue | any,
    firstMessage: boolean = false,
    isQueue: boolean = false,
    menssage?: any,
    msg?: WAMessage | any,
): Promise<void> => {
    if (
        ticket.status === "pending" &&
        !ticket.isGroup &&
        !ticket.answered &&
        ticket.is_chat_ia &&
        queue.from_ia
    ) {

        if (msg && msg.fromMe) return

        const wallet = await ContactWallet.findOne({
            where: {
                contactId: ticket.contactId
            }
        })

        if (!!wallet) {
            await UpdateQueueIATicket(null, ticket, wallet.walletId)
            return;
        }

        try {
            const contact = await Contact.findByPk(ticket.contactId)
            const tenant = await Tenant.findByPk(ticket.tenantId)

            const configuration: ClientOptions = {
                apiKey: tenant.apiKey
            };

            const openai = new OpenAI(configuration);

            const promptSystem = `Nas respostas utilize o nome do cliente que se chama ${sanitizeName(contact.name || "Amigo(a)")} 
            \n com as seguintes informações ${queue.prompt}\n`;

            let completion: ChatCompletion = {} as ChatCompletion;

            if (firstMessage) {
                completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: promptSystem }
                    ],
                    model: "gpt-3.5-turbo",
                    temperature: 1
                });
            } else {
                const body = await getBodyMessage(msg);
                completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: promptSystem },
                        { role: "user", content: body }
                    ],
                    model: "gpt-3.5-turbo",
                    temperature: 1,
                });
            }

            const messageData = {
                body: completion.choices[0].message.content,
                fromMe: true,
                read: true,
                sendType: "bot"
            };

            await CreateMessageSystemService({
                msg: messageData,
                tenantId: ticket.tenantId,
                ticket,
                sendType: messageData.sendType,
                status: "pending"
            });

        } catch (error) {
            console.log(error)
        }
    }

};

const sanitizeName = (name: string): string => {
    let sanitized = name.split(" ")[0];
    sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, "");
    return sanitized.substring(0, 60);
};

export default VerifyMensageOpenIAQueue;