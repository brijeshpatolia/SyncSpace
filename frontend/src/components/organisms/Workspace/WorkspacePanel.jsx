import { AlertTriangleIcon, HashIcon, Loader, PlusIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { CreateChannelModal } from '@/components/molecules/Channel/CreateChannelModal';
import { WorkspacePanelHeader } from '@/components/molecules/Workspace/WorkspacePanelHeader';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { useAuth } from '@/hooks/context/useAuth';
import { useCreateChannelModal } from '@/hooks/context/useCreateChannelModal';

export const WorkspacePanel = () => {
    const { workspaceId, channelId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { setOpenCreateChannelModal } = useCreateChannelModal();
    const { isFetching, workspace, isSuccess } = useGetWorkspaceById(workspaceId);

    if (isFetching) {
        return (
            <div className="flex flex-col gap-y-2 h-full items-center justify-center text-white">
                <Loader className="animate-spin size-6 text-white" />
            </div>
        );
    }

    if (!isSuccess) {
        return (
            <div className="flex flex-col gap-y-2 h-full items-center justify-center text-white">
                <AlertTriangleIcon className="h-6 w-6 text-red-500" />
                <span className="text-sm">
                    An error occurred while fetching the workspace. Please try again later.
                </span>
            </div>
        );
    }

    const isAdmin = workspace?.members?.some(
        (member) =>
            member.memberId === auth?.user?._id && member.role === 'Admin'
    );

    const channels = workspace?.channels ?? [];

    return (
        <div className="flex flex-col h-full bg-slack-medium">
            <WorkspacePanelHeader workspace={workspace} />

            <div className="flex flex-col px-2 mt-3">
                <div className="flex items-center justify-between px-2 group">
                    <span className="text-sm font-semibold text-white/70">
                        Channels
                    </span>
                    {isAdmin && (
                        <button
                            onClick={() => setOpenCreateChannelModal(true)}
                            className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            aria-label="Create channel"
                        >
                            <PlusIcon className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-col mt-1">
                    {channels.length === 0 && (
                        <span className="px-2 py-1 text-xs text-white/50">
                            No channels yet.
                        </span>
                    )}
                    {channels.map((channel) => {
                        const isActive = channel._id === channelId;
                        return (
                            <button
                                key={channel._id}
                                onClick={() =>
                                    navigate(
                                        `/workspaces/${workspaceId}/channels/${channel._id}`
                                    )
                                }
                                className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors truncate ${
                                    isActive
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10'
                                }`}
                            >
                                <HashIcon className="size-4 shrink-0" />
                                <span className="truncate">{channel.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <CreateChannelModal />
        </div>
    );
};
