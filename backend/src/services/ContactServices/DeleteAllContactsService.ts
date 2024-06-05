// Exemplo de DeleteAllContactsService.ts

import Contact from "../../models/Contact";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import socketEmit from "../../helpers/socketEmit";

interface Request {
  tenantId: string | number;
}

const DeleteAllContactsService = async ({ tenantId }: Request): Promise<void> => {
  try {
    // Encontrar todos os contatos associados ao tenantId
    const contacts = await Contact.findAll({
      where: { tenantId }
    });

    // Verificar se há contatos a serem excluídos
    if (!contacts || contacts.length === 0) {
      throw new AppError("ERR_NO_CONTACTS_FOUND", 404);
    }

    // Iterar sobre os contatos e excluir cada um
    for (const contact of contacts) {
      const tickets = await Ticket.count({
        where: { contactId: contact.id }
      });

      if (tickets) {
        // Você pode decidir como lidar com contatos que têm tickets registrados (por exemplo, lançar um erro ou fazer alguma ação)
        console.warn(`Contato ${contact.id} possui tickets registrados. Não será excluído.`);
      } else {
        // Excluir o contato se não houver tickets registrados
        await contact.destroy();

        // Emitir evento de exclusão para o socket
        socketEmit({
          tenantId,
          type: "contact:delete",
          payload: contact
        });
      }
    }
  } catch (error) {
    // Lide com o erro de acordo com as necessidades do seu aplicativo
    console.error('Erro ao excluir todos os contatos:', error);
    throw new AppError("ERR_DELETE_ALL_CONTACTS", 500);
  }
};

export default DeleteAllContactsService;
