import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import socketEmit from "../../helpers/socketEmit";

const UpdateQueueIATicket = async (
    queueId: number | null,
    ticket: Ticket,
    userId: number | null = null,
): Promise<any> => {

    if (!ticket) {
        throw new AppError("ERR_NO_TICKET_FOUND", 404);
    }

    await ticket.update({ queueId, stepChatFlow: null, chatFlowId: null, is_chat_ia: false, userId })

    await ticket.reload();

    socketEmit({
        tenantId: ticket.tenantId,
        type: "ticket:update",
        payload: ticket
    });

    return { ticket };
};

export default UpdateQueueIATicket;
