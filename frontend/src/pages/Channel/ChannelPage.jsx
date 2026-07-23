import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangleIcon, HashIcon, Loader } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ChatInput } from '@/components/molecules/Message/ChatInput';
import { MessageList } from '@/components/organisms/Messages/MessageList';
import { NEW_MESSAGE_EVENT } from '@/context/SocketContext';
import { useGetChannelById } from '@/hooks/apis/channels/useGetChannelById';
import { useCreateMessage } from '@/hooks/apis/messages/useCreateMessage';
import { useGetChannelMessages } from '@/hooks/apis/messages/useGetChannelMessages';
import { useSocket } from '@/hooks/context/useSocket';

export const ChannelPage = () => {
    const { channelId } = useParams();
    const queryClient = useQueryClient();

    const { channel, isFetching: isChannelFetching, isSuccess } = useGetChannelById(channelId);
    const { messages, isLoading: areMessagesLoading } = useGetChannelMessages(channelId);
    const { createMessageMutation } = useCreateMessage(channelId);
    const { socket, joinChannel } = useSocket();

    const messagesQueryKey = `fetchMessages-${channelId}`;

    // Insert a message into the cache, keeping newest-first order and skipping
    // duplicates (the sender receives their own message back over the socket).
    const upsertMessage = useCallback(
        (message) => {
            queryClient.setQueryData([messagesQueryKey], (old) => {
                const list = Array.isArray(old) ? old : [];
                if (list.some((m) => m._id === message._id)) return list;
                return [message, ...list];
            });
        },
        [queryClient, messagesQueryKey]
    );

    // Join the channel room and subscribe to realtime messages.
    useEffect(() => {
        if (!socket || !channelId) return;
        joinChannel(channelId);
        const handler = (message) => upsertMessage(message);
        socket.on(NEW_MESSAGE_EVENT, handler);
        return () => {
            socket.off(NEW_MESSAGE_EVENT, handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, channelId]);

    async function handleSend(body) {
        const saved = await createMessageMutation({ body });
        // Reflect immediately in case the socket echo is delayed; dedup handles overlap.
        if (saved?._id) upsertMessage(saved);
    }

    if (isChannelFetching) {
        return (
            <div className="h-full flex items-center justify-center bg-white">
                <Loader className="animate-spin size-6 text-gray-400" />
            </div>
        );
    }

    if (!isSuccess || !channel) {
        return (
            <div className="h-full flex flex-col gap-y-2 items-center justify-center bg-white text-gray-500">
                <AlertTriangleIcon className="size-6 text-red-500" />
                <span className="text-sm">Channel not found or you don&apos;t have access.</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center gap-2 px-4 h-[50px] border-b border-gray-200 shrink-0">
                <HashIcon className="size-5 text-gray-700" />
                <span className="font-semibold text-gray-900">{channel.name}</span>
            </div>

            <MessageList messages={messages ?? []} isLoading={areMessagesLoading} />

            <ChatInput
                onSubmit={handleSend}
                placeholder={`Message #${channel.name}`}
            />
        </div>
    );
};
