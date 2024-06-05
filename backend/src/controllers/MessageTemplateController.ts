import { Request, Response } from 'express';
import MessageTemplate from '../models/MessageTemplate';

class MessageTemplateController {
  async createMessageTemplate(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const { tenantId } = req.user;
        const { trans_status_code, message, whatsappId } = req.body;

        // Verifica se já existe um template para esse status e tenatnId
        const existingTemplate = await MessageTemplate.findOne({ where: { tenantId, trans_status_code, whatsappId } });
        if (existingTemplate) {
            // Se já existir um template, Aqui se atualizar a mensagem
            existingTemplate.message = message;
            await existingTemplate.save();
            return res.status(200).json(existingTemplate);
        }

        // Se não existir um template, ele cria um novinho
        const messageTemplate = await MessageTemplate.create({ trans_status_code, message, whatsappId, tenantId });
        return res.status(201).json(messageTemplate);
    } catch (error) {
        console.error('Erro ao criar ou atualizar template de mensagem:', error);
        return res.status(500).json({ error: 'Erro ao criar ou atualizar template de mensagem' });
    }
}

async listMessageTemplates(req: Request, res: Response): Promise<void> {
    try {
        const templates = await MessageTemplate.findAll();

        res.status(200).json(templates);
    } catch (error) {
        console.error('Erro ao listar os templates de mensagens:', error);
        res.status(500).json({ error: 'Erro ao listar os templates de mensagens' });
    }
}

async updateMessageTemplate(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const { tenantId } = req.user;
        const { id } = req.params;
        const { trans_status_code, message, whatsappId } = req.body;

        const existingTemplate = await MessageTemplate.findOne({ where: { id, tenantId } });
        if (!existingTemplate) {
            return res.status(404).json({ error: 'Template não encontrado.' });
        }

        // aqui é para poder atualizar os campos
        existingTemplate.trans_status_code = trans_status_code;
        existingTemplate.message = message;
        existingTemplate.whatsappId = whatsappId;

        await existingTemplate.save();

        return res.status(200).json(existingTemplate);
    } catch (error) {
        console.error('Erro ao atualizar template de mensagem:', error);
        return res.status(500).json({ error: 'Erro ao atualizar template de mensagem' });
    }
}

}

export default new MessageTemplateController();
