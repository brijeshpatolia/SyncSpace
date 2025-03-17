import Message from "../schema/message";
import crudRepository from "./crudRepository";


const messageRepository = {
    ...crudRepository(Message),
    getPaginatedMessages: async (messageParams , page ,limit) => {
        const messages  = await Message.find(messageParams)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('senderId', 'username email avatar')
        .populate('channelId', 'name')
        .populate('workspaceId')
        return messages;
    }
}

export default messageRepository;