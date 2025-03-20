import { StatusCodes } from 'http-status-codes';
import {
  customErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';
import { createMessageService, getMessagesService } from '../services/messagesService.js';
import { io } from '../index.js';



export const getMessagesController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const channelId = req.params.channelId;
    const userId = req.user.id; // Extract user ID from request

    if (!channelId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Channel ID is required.',
          statusCode: StatusCodes.BAD_REQUEST
        })
      );
    }

    console.log(`[DEBUG] Fetching messages - Channel ID: ${channelId}, Page: ${page}, Limit: ${limit}`);

    const messages = await getMessagesService({ channelId }, Number(page), Number(limit), userId);

    console.log('[SUCCESS] Messages fetched successfully!', messages.length);

    return res.status(StatusCodes.OK).json(successResponse(messages, 'Messages fetched successfully!'));
  } catch (error) {
    console.error('[ERROR] Exception in getMessagesController:', error);

    return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
      customErrorResponse({
        message: error?.message || 'Internal Server Error',
        statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
      })
    );
  }
};

export const createMessageController = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.channelId;
    const { body, image } = req.body; // Extracting only relevant fields

    if (!channelId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Channel ID is required.',
          statusCode: StatusCodes.BAD_REQUEST
        })
      );
    }

    if (!body) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Message body is required.',
          statusCode: StatusCodes.BAD_REQUEST
        })
      );
    }

    // Call service with the correct parameters
    const savedMessage = await createMessageService({ body, image }, userId, channelId);

    // Emit the event to users in the specific channel
    io.to(channelId).emit('newMessage', savedMessage);

    console.log('[SUCCESS] Message created:', savedMessage);

    return res.status(StatusCodes.CREATED).json(successResponse(savedMessage, 'Message created successfully!'));
  } catch (error) {
    console.error('[ERROR] Exception in createMessageController:', error);
    return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
      customErrorResponse({
        message: error?.message || 'Internal Server Error',
        statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
      })
    );
  }
};
