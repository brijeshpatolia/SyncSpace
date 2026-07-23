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

export const updateMessageService = async (messageId, userId, body) => {
    try {
        const message = await messageRepository.getById(messageId);
        if (!message) {
            throw customErrorResponse({
                message: "Message not found.",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        // Only the author can edit their own message.
        if (message.senderId.toString() !== userId) {
            throw customErrorResponse({
                message: "You can only edit your own messages.",
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        message.body = body;
        await message.save();
        await message.populate('senderId', 'username email avatar');
        return message;
    } catch (error) {
        console.error("[ERROR] updateMessageService:", error);
        throw error;
    }
};

export const deleteMessageService = async (messageId, userId) => {
    try {
        const message = await messageRepository.getById(messageId);
        if (!message) {
            throw customErrorResponse({
                message: "Message not found.",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        if (message.senderId.toString() !== userId) {
            throw customErrorResponse({
                message: "You can only delete your own messages.",
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        const channelId = message.channelId;
        await messageRepository.delete(messageId);
        return { messageId, channelId };
    } catch (error) {
        console.error("[ERROR] deleteMessageService:", error);
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

        // Populate the sender so REST responses and the realtime socket payload
        // both carry the author's identity (needed to render the message list).
        await newMessage.populate('senderId', 'username email avatar');

        console.log("[SUCCESS] Message created:", newMessage);
        return newMessage;
    } catch (error) {
        console.error("[ERROR] createMessageService:", error);
        throw error;
    }
};
