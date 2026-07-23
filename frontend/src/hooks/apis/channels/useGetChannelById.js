import { useQuery } from '@tanstack/react-query';

import { getChannelByIdRequest } from '@/apis/channels';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetChannelById = (channelId) => {
    const { auth } = useAuth();

    const { isFetching, isLoading, isSuccess, error, data: channel } = useQuery({
        queryFn: () => getChannelByIdRequest({ channelId, token: auth?.token }),
        queryKey: [`fetchChannelById-${channelId}`],
        enabled: !!channelId && !!auth?.token,
        staleTime: 10000
    });

    return {
        isFetching,
        isLoading,
        isSuccess,
        error,
        channel
    };
};
