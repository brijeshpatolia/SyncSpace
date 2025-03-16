
import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse } from "../utils/common/responseObjects.js";

import workspaceRepository from "../repositories/workspaceRepository.js";
import channelRepository from "../repositories/channelRepository.js";

export const getChannelByIdService = async (channelId, userId) => {
    try {
        console.log(`[DEBUG] Fetching channel with ID: ${channelId} for user ${userId}`);

        // Step 1: Get the channel
        const channel = await channelRepository.getById(channelId);

        if (!channel) {
            console.warn(`[WARNING] Channel with ID ${channelId} not found`);
            return customErrorResponse({ message: "Channel not found", statusCode: StatusCodes.NOT_FOUND });
        }

        console.log(`[DEBUG] Channel retrieved: ${channel.name}, associated workspace ID: ${channel.workspaceId}`);

        // Step 2: Fetch the workspace using workspaceId from the channel
        const workspace = await workspaceRepository.getById(channel.workspaceId);

        if (!workspace) {
            console.error(`[ERROR] Workspace ${channel.workspaceId} not found for channel ${channelId}`);
            return customErrorResponse({ message: "Workspace not found for this channel", statusCode: StatusCodes.NOT_FOUND });
        }

        console.log("[DEBUG] Checking if user is a member of workspace:", workspace._id);

        // Step 3: Check if the user is a member of the workspace
        const isMember = workspace.members.some(member => member.memberId.toString() === userId);

        if (!isMember) {
            console.warn(`[WARNING] User ${userId} is not authorized to access channel ${channelId}`);
            return customErrorResponse({ message: "You are not authorized to view this channel.", statusCode: StatusCodes.FORBIDDEN });
        }

        console.log("[SUCCESS] User is authorized. Returning channel data.");
        return channel;

    } catch (error) {
        console.error(`[ERROR] Exception in getChannelByIdService: ${error.message}`);
        return internalErrorResponse(error);
    }
};


