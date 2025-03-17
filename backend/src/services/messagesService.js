import messageRepository from "../repositories/messageRepository.js";
import Channel from "../schema/channel.js";
import { isMemberPartOfWorkspace } from "../services/memberService.js";
import { customErrorResponse } from "../utils/common/responseObjects.js";
import { StatusCodes } from "http-status-codes";

export const getMessagesService = async (messageParams, page, limit, userId) => {
    try {
        const channel = await Channel.findById(messageParams.channelId);
        if (!channel) {
            throw customErrorResponse({
                message: "Channel not found.",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        await isMemberPartOfWorkspace(channel.workspaceId, userId); // Throws error if not a member

        return await messageRepository.getPaginatedMessages(messageParams, page, limit);
    } catch (error) {
        console.error("[ERROR] getMessagesService:", error.message);
        throw error; // Ensures controller catches and returns proper error response
    }
};
