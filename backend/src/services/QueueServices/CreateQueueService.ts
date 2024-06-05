// import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";

interface Request {
  queue: string;
  isActive: boolean;
  from_ia: boolean;
  userId: number;
  tenantId: number | string;
  prompt?: string;
}

const CreateQueueService = async ({
  queue,
  isActive,
  userId,
  from_ia,
  tenantId,
  prompt
}: Request): Promise<Queue> => {
  
  const queueData = await Queue.create({
    queue,
    isActive,
    userId,
    from_ia,
    tenantId,
    prompt
  });

  return queueData;
};

export default CreateQueueService;
