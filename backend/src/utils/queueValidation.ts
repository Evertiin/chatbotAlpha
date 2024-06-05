
import { sendMessageBaileys } from '../jobs/SendMessages';
import Message from '../models/Message';
import ShowWhatsAppService from '../services/WhatsappService/ShowWhatsAppService';
export default async function queueValidation(whatsappId: number | string, tenantId: number | string, messages: Message[] | undefined = undefined) {
    
    const whatsapp = await ShowWhatsAppService({ id: whatsappId })
    if (whatsapp.type === "whatsapp") {
        await sendMessageBaileys(whatsappId, tenantId, messages);
    }
}