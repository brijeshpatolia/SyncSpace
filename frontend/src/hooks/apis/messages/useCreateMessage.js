import { useMutation } from '@tanstack/react-query';

import { createMessageRequest } from '@/apis/messages';
import { useAuth } from '@/hooks/context/useAuth';

export const useCreateMessage = (channelId) => {
    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: createMessageMutation } = useMutation({
        mutationFn: (data) => createMessageRequest({ ...data, channelId, token: auth?.token }),
        onError: (error) => {
            console.error('Failed to send message', error);
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        createMessageMutation
    };
};
