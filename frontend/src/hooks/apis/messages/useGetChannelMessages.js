import { useQuery } from '@tanstack/react-query';

import { getMessagesRequest } from '@/apis/messages';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetChannelMessages = (channelId) => {
    const { auth } = useAuth();

    const { isFetching, isLoading, isSuccess, error, data: messages } = useQuery({
        queryFn: () => getMessagesRequest({ channelId, token: auth?.token }),
        queryKey: [`fetchMessages-${channelId}`],
        enabled: !!channelId && !!auth?.token
    });

    return {
        isFetching,
        isLoading,
        isSuccess,
        error,
        messages
    };
};
