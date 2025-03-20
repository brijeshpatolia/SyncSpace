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

        await isMemberPartOfWorkspace(channel.workspaceId.toString(), userId);

        // Fetch paginated messages
        const messages = await messageRepository.getPaginatedMessages(messageParams, page, limit);
        console.log("[DEBUG] Messages fetched:", messages.length);

        return messages;
    } catch (error) {
        console.error("[ERROR] getMessagesService:", error.message);
        throw error;
    }
};

export const createMessageService = async ({ body, image }, userId, channelId) => {
    try {
        const channel = await Channel.findById(channelId);
        if (!channel) {
            throw customErrorResponse({
                message: "Channel not found.",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        await isMemberPartOfWorkspace(channel.workspaceId.toString(), userId);

        const newMessage = await messageRepository.create({
            body,
            image,
            senderId: userId,
            channelId,
            workspaceId: channel.workspaceId
        });

        console.log("[SUCCESS] Message created:", newMessage);
        return newMessage;
    } catch (error) {
        console.error("[ERROR] createMessageService:", error);
        throw error;
    }
};
