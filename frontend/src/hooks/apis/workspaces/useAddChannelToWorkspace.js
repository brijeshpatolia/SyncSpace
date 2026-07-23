import { useMutation } from '@tanstack/react-query';

import { addChannelToWorkspaceRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useAddChannelToWorkspace = () => {
    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: addChannelToWorkspaceMutation } = useMutation({
        mutationFn: (data) => addChannelToWorkspaceRequest({ ...data, token: auth?.token }),
        onSuccess: (data) => {
            console.log('Successfully added channel to workspace', data);
        },
        onError: (error) => {
            console.error('Failed to add channel to workspace', error);
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        addChannelToWorkspaceMutation
    };
};
