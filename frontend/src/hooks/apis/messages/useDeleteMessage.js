import { useMutation } from '@tanstack/react-query';

import { deleteMessageRequest } from '@/apis/messages';
import { useAuth } from '@/hooks/context/useAuth';

export const useDeleteMessage = () => {
    const { auth } = useAuth();

    const { isPending, error, mutateAsync: deleteMessageMutation } = useMutation({
        mutationFn: (data) => deleteMessageRequest({ ...data, token: auth?.token })
    });

    return {
        isPending,
        error,
        deleteMessageMutation
    };
};
