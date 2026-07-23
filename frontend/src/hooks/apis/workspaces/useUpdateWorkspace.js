import { useMutation } from '@tanstack/react-query';

import { updateWorkspaceRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateWorkspace = (workspaceId) => {
    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: updateWorkspaceMutation } = useMutation({
        mutationFn: (data) => updateWorkspaceRequest({ ...data, workspaceId, token: auth?.token }),
        onError: (error) => {
            console.error('Failed to update workspace', error);
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        updateWorkspaceMutation
    };
};
