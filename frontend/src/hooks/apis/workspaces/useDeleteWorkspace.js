import { useMutation } from '@tanstack/react-query';

import { deleteWorkspaceRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useDeleteWorkspace = (workspaceId) => {
    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: deleteWorkspaceMutation } = useMutation({
        mutationFn: () => deleteWorkspaceRequest({ workspaceId, token: auth?.token }),
        onError: (error) => {
            console.error('Failed to delete workspace', error);
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        deleteWorkspaceMutation
    };
};
