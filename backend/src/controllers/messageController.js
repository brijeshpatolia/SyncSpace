import { StatusCodes } from 'http-status-codes'
import { getMessagesService } from '../services/messageService.js'
import {
  customErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js'

export const getMessagesController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const channelId = req.params.channelId
    const userId = req.user.id // Extract user ID from request
    if (!channelId) {
      console.error('[ERROR] Missing channelId in request parameters.')
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Channel ID is required.',
          statusCode: StatusCodes.BAD_REQUEST
        })
      )
    }

    console.log(
      `[DEBUG] Fetching messages - Channel ID: ${channelId}, Page: ${page}, Limit: ${limit}`
    )

    const messages = await getMessagesService(
      { channelId },
      Number(page),
      Number(limit),
      userId
    )

    console.log('[SUCCESS] Messages fetched successfully!')

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'Messages fetched successfully!'))
  } catch (error) {
    console.error('[ERROR] Exception in getMessagesController:', error)

    return res
      .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        customErrorResponse({
          message: error?.message || 'Internal Server Error',
          statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
        })
      )
  }
}
