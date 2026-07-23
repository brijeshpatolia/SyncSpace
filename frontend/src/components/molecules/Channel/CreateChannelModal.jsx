import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAddChannelToWorkspace } from '@/hooks/apis/workspaces/useAddChannelToWorkspace';
import { useCreateChannelModal } from '@/hooks/context/useCreateChannelModal';
import { useToast } from '@/hooks/use-toast';

export const CreateChannelModal = () => {
    const { workspaceId } = useParams();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { openCreateChannelModal, setOpenCreateChannelModal } = useCreateChannelModal();
    const { isPending, addChannelToWorkspaceMutation } = useAddChannelToWorkspace();

    const [channelName, setChannelName] = useState('');

    function handleClose() {
        setOpenCreateChannelModal(false);
        setChannelName('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await addChannelToWorkspaceMutation({
                workspaceId,
                channelName: channelName.trim()
            });
            queryClient.invalidateQueries({ queryKey: [`fetchWorkspaceById-${workspaceId}`] });
            toast({ title: 'Channel created' });
        } catch (error) {
            console.log('Error creating channel', error);
            toast({
                title: error?.message || 'Could not create channel',
                variant: 'destructive'
            });
        } finally {
            handleClose();
        }
    }

    return (
        <Dialog open={openCreateChannelModal} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a channel</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <Input
                        required
                        disabled={isPending}
                        minLength={3}
                        placeholder="e.g. marketing, dev-team, random"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                    />

                    <div className="flex justify-end mt-5">
                        <Button disabled={isPending || channelName.trim().length < 3}>
                            {isPending ? 'Creating...' : 'Create channel'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
