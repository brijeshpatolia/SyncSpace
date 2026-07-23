import { CopyIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { useInviteMemberModal } from '@/hooks/context/useInviteMemberModal';
import { useToast } from '@/hooks/use-toast';

export const InviteMemberModal = () => {
    const { workspaceId } = useParams();
    const { toast } = useToast();
    const { openInviteMemberModal, setOpenInviteMemberModal } = useInviteMemberModal();
    const { workspace } = useGetWorkspaceById(workspaceId);

    async function handleCopy() {
        if (!workspace?.joinCode) return;
        try {
            await navigator.clipboard.writeText(workspace.joinCode);
            toast({ title: 'Join code copied to clipboard' });
        } catch {
            toast({
                title: 'Could not copy to clipboard',
                variant: 'destructive'
            });
        }
    }

    return (
        <Dialog
            open={openInviteMemberModal}
            onOpenChange={() => setOpenInviteMemberModal(false)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite people to {workspace?.name}</DialogTitle>
                    <DialogDescription>
                        Share this join code with anyone you want to invite. They can use
                        it from the Home page to join your workspace.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-3 py-6">
                    <p className="text-4xl font-bold uppercase tracking-widest text-gray-900">
                        {workspace?.joinCode || '—'}
                    </p>
                    <Button
                        variant="ghost"
                        onClick={handleCopy}
                        disabled={!workspace?.joinCode}
                    >
                        <CopyIcon className="size-4 mr-1" />
                        Copy code
                    </Button>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
