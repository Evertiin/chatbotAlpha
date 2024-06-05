import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";

interface QueueData {
  queue: string;
  isActive: boolean;
  from_ia: boolean;
  userId: number;
  tenantId: number | string;
  prompt?: string;
}

interface Request {
  queueData: QueueData;
  queueId: string;
}

const UpdateQueueService = async ({
  queueData,
  queueId
}: Request): Promise<Queue> => {
  const { queue, isActive, userId, tenantId, from_ia , prompt } = queueData;

  const queueModel = await Queue.findOne({
    where: { id: queueId, tenantId },
    attributes: ["id", "queue", "isActive", "userId", "from_ia"]
  });

  if (!queueModel) {
    throw new AppError("ERR_NO_QUEUE_FOUND", 404);
  }

  await queueModel.update({
    queue,
    isActive,
    from_ia,
    userId,
    prompt
  });

  await queueModel.reload({
    attributes: ["id", "queue", "isActive", "userId", "from_ia"]
  });

  return queueModel;
};

export default UpdateQueueService;
