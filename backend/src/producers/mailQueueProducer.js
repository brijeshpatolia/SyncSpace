import mailQueue from "../queues/mailQueue.js";
import '../processor/emailQueueProcessor.js';
import { internalErrorResponse } from "../utils/common/responseObjects.js";

export const addEmailtoMailQueue = async (emailData) => {
  try {
    await mailQueue.add({
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text
    });
    console.log(`Email job added successfully for ${emailData.to}`);
  } catch (error) {
    console.error('[ERROR] Failed to add email to queue:', error);
    throw internalErrorResponse(error);
  }
};
