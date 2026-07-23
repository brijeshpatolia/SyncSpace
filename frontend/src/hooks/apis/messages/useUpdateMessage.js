import { useMutation } from '@tanstack/react-query';

import { updateMessageRequest } from '@/apis/messages';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateMessage = () => {
    const { auth } = useAuth();

    const { isPending, error, mutateAsync: updateMessageMutation } = useMutation({
        mutationFn: (data) => updateMessageRequest({ ...data, token: auth?.token })
    });

    return {
        isPending,
        error,
        updateMessageMutation
    };
};
