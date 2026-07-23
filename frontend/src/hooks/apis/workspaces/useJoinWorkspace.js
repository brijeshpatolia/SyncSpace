import { useMutation } from '@tanstack/react-query';

import {
    addMemberToWorkspaceRequest,
    getWorkspaceByJoinCodeRequest
} from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

// Two-step join: look up the workspace by its join code, then add the current
// authenticated user as a member.
export const useJoinWorkspace = () => {
    const { auth } = useAuth();

    const { isPending, error, mutateAsync: joinWorkspaceMutation } = useMutation({
        mutationFn: async ({ joinCode }) => {
            const workspace = await getWorkspaceByJoinCodeRequest({
                joinCode,
                token: auth?.token
            });
            if (!workspace?._id) {
                throw new Error('Invalid join code.');
            }
            await addMemberToWorkspaceRequest({
                workspaceId: workspace._id,
                token: auth?.token
            });
            return workspace;
        }
    });

    return {
        isPending,
        error,
        joinWorkspaceMutation
    };
};
