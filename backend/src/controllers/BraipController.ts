import { Request, Response } from 'express';
import MessageTemplate from '../models/MessageTemplate';
import { getWbot } from '../libs/wbot-baileys';
import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";

const ABANDONO_CODE = '11';


export async function handlePostback(req: Request, res: Response) {
    const tenantId = req.params.tenantId;
    const postData = req.body;

    let clientCel = postData.client_cel;

    try {
        // Validar o número de telefone do cliente

        // Aqui eu valido se o whatsapp esta conectado
        const whatsapp = await Whatsapp.findOne({ where: { status: "CONNECTED", tenantId, type: "whatsapp" } });

        if (!whatsapp) {
            throw new AppError("NOT_FOUND_WHATSAPP_CONNECTED", 404)
        }

        // aqui eu valido o numero de acordo com o whastappId conectado
        const wbot = await getWbot(whatsapp.id)
        const chatId = `${clientCel}@$s.whatsapp.net`;
        const jid = await wbot.onWhatsApp(chatId);
        // Se não for valido se existe no whatsapp
        if (jid[0].exists == false) {
            throw new AppError("CONTACT_NOT_FOUND", 404)
        }
        // verifica o numero correto que esta cadastrado
        console.log(clientCel)
        clientCel = jid[0].jid.split('@')[0]
        if (!jid) {
            console.error('Número de WhatsApp inválido:', clientCel);
            return res.status(400).json({ error: 'Número de WhatsApp inválido' });
        }
        // Verifica se o tipo da transação é ABANDONO e atribui o código interno correspondente

        if (postData.type === 'ABANDONO') {
            postData.trans_status_code = ABANDONO_CODE;
        }

        const message = await MessageTemplate.findOne({ where: { tenantId, trans_status_code: postData.trans_status_code } });

        if (!message) {
            console.error('Mensagem não encontrada para o status fornecido');
            return res.status(404).json({ error: 'Mensagem não encontrada para o status fornecido' });
        }


        // Mapear o código numérico de trans_payment para o nome correspondente
        let paymentMethod;
        switch (postData.trans_payment) {
            case 1:
                paymentMethod = 'Boleto';
                break;
            case 2:
                paymentMethod = 'Cartão de Crédito';
                break;
            case 3:
                paymentMethod = 'Boleto Parcelado';
                break;
            case 4:
                paymentMethod = 'Grátis';
                break;
            case 5:
                paymentMethod = 'Pix';
                break;
            default:
                paymentMethod = 'Desconhecido';
        }
        // Definir trans_payment com o nome do método de pagamento correspondente
        postData.trans_payment = paymentMethod;

        // Chamando a função replaceVariables com os dados atualizados
        const formattedMessage = replaceVariables(message.message, postData);

        await sendMessageToClient(clientCel, formattedMessage, message.whatsappId);

        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao processar o postback:', error);
        res.status(500).json({ error: 'Erro ao processar o postback' });
    }
}

function replaceVariables(message, postData) {
    let formattedMessage = message;

    formattedMessage = formattedMessage.replace(/{{nome}}/g, postData.client_name);
    formattedMessage = formattedMessage.replace(/{{status}}/g, postData.trans_status || postData.type);
    formattedMessage = formattedMessage.replace(/{{email}}/g, postData.client_email);
    formattedMessage = formattedMessage.replace(/{{checkout_url}}/g, postData.checkout_url);

    // Verificar se postData.trans_items está definido e possui elementos
    if (postData.trans_items && postData.trans_items.length > 0) {
        formattedMessage = formattedMessage.replace(/{{produto}}/g, postData.trans_items[0].product_name);
        formattedMessage = formattedMessage.replace(/{{valor}}/g, postData.trans_items[0].plan_value);
        formattedMessage = formattedMessage.replace(/{{quantidade}}/g, postData.trans_items[0].plan_amount);
    } else {
        // Se não houver trans_items, substituir as variáveis por uma string vazia
        formattedMessage = formattedMessage.replace(/{{produto}}/g, '');
        formattedMessage = formattedMessage.replace(/{{valor}}/g, '');
        formattedMessage = formattedMessage.replace(/{{quantidade}}/g, '');
        formattedMessage = formattedMessage.replace(/{{checkout_url}}/g, '');

    }

    // Variável para armazenar o texto específico com base no método de pagamento
    let paymentInfo = '';

    // Adicionar texto específico com base no método de pagamento
    if (postData.trans_payment === 'Boleto') {
        paymentInfo = `\n\n🧾 *Forma de pagamento:* Boleto\n\n🔗 *Você pode acessar o link a seguir para visualizar e imprimir o boleto:* ${postData.trans_payment_url}\n\n📄 *Código de Barras:* ${postData.trans_payment_bar_code}\n\n`;
    } else if (postData.trans_payment === 'Pix') {
        paymentInfo = `\n\n📱 *Forma de pagamento:* Pix\n\n🔗 *Acesse o site indicado para efetuar o pagamento através do Pix:* ${postData.trans_url_pix}\n\n📷 *QR Code Pix: Copie e cole o QR Code Pix abaixo para realizar o pagamento:* ${postData.trans_qrcode_pix}\n\n`;
    } else if (postData.trans_payment === 'Cartão de Crédito') {
        paymentInfo = `\n\n💳 *Forma de pagamento:* Cartão de Crédito\n\n*Número de Parcelas:* ${postData.trans_installments}\n\n`;
    } else if (postData.trans_payment === 'Boleto Parcelado') {
        paymentInfo = `\n\n📦 *Forma de pagamento:* Boleto Parcelado\n\n🔗 *Você pode acessar o link a seguir para visualizar e imprimir o boleto:* ${postData.trans_payment_url}\n\n📄 *Código de Barras:* ${postData.trans_payment_bar_code}\n\nNúmero de Parcelas: ${postData.trans_installments}\n\n`;
    } else if (postData.trans_payment === 'Grátis') {
        paymentInfo = `\n\n🆓 *Forma de pagamento:* Grátis\n\n`;
    } else {
        paymentInfo = `\n\n💵 *Forma de pagamento desconhecida:* ${postData.trans_payment}`;
    }
    console.log('Tipo de postData.trans_payment:', typeof postData.trans_payment);

    // Substituir a variável de placeholder pela informação do pagamento
    formattedMessage = formattedMessage.replace(/{{pagamento}}/g, paymentInfo);
    console.log('paymentInfo:', paymentInfo);

    return formattedMessage;
}

export async function sendMessageToClient(clientCel, message, whatsappId) {
    try {
        // Remover espaços em branco
        const cleanedClientCel = clientCel.replace(/\s/g, '');

        const wbot = getWbot(whatsappId);

        await wbot.sendMessage(`${cleanedClientCel}@s.whatsapp.net`, { text: message });

    } catch (error) {
        console.error('Erro ao enviar mensagem para o cliente:', error);
        throw new Error(error);
    }
}

