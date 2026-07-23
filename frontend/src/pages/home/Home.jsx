import { useQueryClient } from '@tanstack/react-query';
import { Loader, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { useJoinWorkspace } from '@/hooks/apis/workspaces/useJoinWorkspace';
import { useCreateWorkspaceModal } from '@/hooks/context/useCreateWorkspaceModal';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { isFetching, workspaces } = useFetchWorkspace();
    const { isPending: isJoining, joinWorkspaceMutation } = useJoinWorkspace();
    const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal();

    const [joinCode, setJoinCode] = useState('');

    useEffect(() => {
        if (isFetching) return;
        if (workspaces?.length > 0) {
            navigate(`/workspaces/${workspaces[0]._id}`);
        }
    }, [isFetching, workspaces, navigate]);

    async function handleJoin(e) {
        e.preventDefault();
        const code = joinCode.trim();
        if (!code) return;
        try {
            const workspace = await joinWorkspaceMutation({ joinCode: code });
            queryClient.invalidateQueries({ queryKey: ['fetchWorkspaces'] });
            toast({ title: `Joined ${workspace?.name}` });
            navigate(`/workspaces/${workspace._id}`);
        } catch (error) {
            toast({
                title: error?.message || 'Could not join workspace',
                variant: 'destructive'
            });
        }
    }

    if (isFetching) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slack">
                <Loader className="animate-spin size-8 text-white" />
            </div>
        );
    }

    // Signed-in user with no workspaces yet: offer to create one or join one.
    return (
        <div className="min-h-screen w-full bg-slack flex flex-col">
            <div className="flex justify-end p-4">
                <UserButton />
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome to your Slack clone
                        </h1>
                        <p className="text-sm text-gray-500">
                            You aren&apos;t part of any workspace yet. Create one or join
                            with an invite code.
                        </p>
                    </div>

                    <Button
                        className="w-full"
                        onClick={() => setOpenCreateWorkspaceModal(true)}
                    >
                        <PlusIcon className="size-4 mr-1" />
                        Create a workspace
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span>OR</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={handleJoin} className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">
                            Join with a code
                        </label>
                        <Input
                            placeholder="Enter join code"
                            value={joinCode}
                            disabled={isJoining}
                            onChange={(e) => setJoinCode(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isJoining || joinCode.trim().length === 0}
                        >
                            {isJoining ? 'Joining...' : 'Join workspace'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
