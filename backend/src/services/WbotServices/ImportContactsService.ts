import * as Sentry from "@sentry/node";
import { getWbot } from "../../libs/wbot-baileys";
import Contact from "../../models/Contact";
import { logger } from "../../utils/logger";
import ShowBaileysService from "../BaileysServices/ShowBaileysService";
import CreateContactService from "../ContactServices/CreateContactService";
import { isString, isArray } from "lodash";
import Whatsapp from "../../models/Whatsapp";
import AppError from "../../errors/AppError";

const ImportContactsService = async (tenantId: number, whatsappId: number): Promise<void> => {
  const wbot = getWbot(whatsappId);

  const whatsappstatus = await Whatsapp.findByPk(whatsappId);
  if (whatsappstatus.status != 'CONNECTED') {
    throw new AppError ('Whatsapp selecionado não esta conectado')
  }  
  let phoneContacts;

  try {
     
    const contactsString = await ShowBaileysService(wbot.id);
    phoneContacts = JSON.parse(JSON.stringify(contactsString.contacts));
  } catch (err) {

    console.log(err)
    Sentry.captureException(err);
    logger.error(`Não foi possível obter os contatos do WhatsApp do telefone. Err: ${err}`);
  }

  const phoneContactsList = isString(phoneContacts)
  ? JSON.parse(phoneContacts)
  : phoneContacts;

if (isArray(phoneContactsList)) {
  phoneContactsList.forEach(async ({ id, name, notify }) => {
    if (id === "status@broadcast" || id.includes("g.us") === "g.us") return;
    const number = id.replace(/\D/g, "");

    const numberExists = await Contact.findOne({
      where: { number, tenantId }
    });

    if (!numberExists) {
      try {
        await CreateContactService({
          number,
          name: name || notify,
          tenantId
        });
      } catch (error) {
        Sentry.captureException(error);
        console.log(error);
        logger.warn(
          `Não foi possível obter os contatos do WhatsApp do telefone. Erro: ${error}`
        );
      }
    }
  });
}


};

export default ImportContactsService;
