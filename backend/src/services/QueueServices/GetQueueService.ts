import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";

const GetQueueService = async (queueId): Promise<Queue> => {

  const queueModel = await Queue.findByPk(queueId);

  if (!queueModel) {
    throw new AppError("ERR_NO_QUEUE_FOUND", 404);
  }

  return queueModel;
};

export default GetQueueService;
