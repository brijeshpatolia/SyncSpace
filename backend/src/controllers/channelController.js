import { StatusCodes } from "http-status-codes";
import { getChannelByIdService } from "../services/channelService.js";
import { customErrorResponse, successResponse } from "../utils/common/responseObjects.js";

export const getChannelByIdController = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const userId = req.user.id;  // Extract user ID from request

        console.log(`[DEBUG] Fetching channel with ID: ${channelId} for user ${userId}`);

        const channel = await getChannelByIdService(channelId, userId);

        // Check if the service returned an error response
        if (!channel || channel.success === false) {
            console.warn(`[WARNING] Unauthorized or missing channel ${channelId}`);
            return res.status(channel?.statusCode || StatusCodes.FORBIDDEN).json(channel);
        }

        console.log("[SUCCESS] Channel retrieved successfully:", channel);
        return res.status(StatusCodes.OK).json(successResponse(channel, "Channel retrieved successfully"));

    } catch (error) {
        console.error("[ERROR] Exception in getChannelByIdController:", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(customErrorResponse(error));
    }
};

