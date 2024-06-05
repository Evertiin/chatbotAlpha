/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "../models/User";
import { logger } from "../utils/logger";
import { getIO } from "../libs/socket";

export default {
  key: "VerifyOnlineUsers",
  options: {
    removeOnComplete: true,
    removeOnFail: false,
    jobId: "VerifyOnlineUsers",
    repeat: {
      every: 60 * 1000
    }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async handle() {
    try {
      logger.info("VerifyOnlineUsers Initiated");
      const users = await User.findAll();
      // users.forEach(async (user) => {
      //   await user.update({ isOnline: false });
      // })
      const io = getIO();
      io.emit('verifyOnlineUsers');
      logger.info("Finalized VerifyOnlineUsers");
    } catch (error) {
      logger.error({ message: "Error VerifyOnlineUsers", error });
      throw new Error(error);
    }
  }
};
