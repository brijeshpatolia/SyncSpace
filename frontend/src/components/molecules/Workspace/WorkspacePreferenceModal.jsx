import { useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import { Input } from '@/components/ui/input';
import { useDeleteWorkspace } from '@/hooks/apis/workspaces/useDeleteWorkspace';
import { useUpdateWorkspace } from '@/hooks/apis/workspaces/useUpdateWorkspace';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';
import { useToast } from '@/hooks/use-toast';

export const WorkspacePreferenceModal = () => {
    const { workspaceId } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { initialValue, openPreferences, setOpenPreferences } =
        useWorkspacePreferenceModal();

    const { isPending: isUpdating, updateWorkspaceMutation } =
        useUpdateWorkspace(workspaceId);
    const { isPending: isDeleting, deleteWorkspaceMutation } =
        useDeleteWorkspace(workspaceId);

    const [editing, setEditing] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [name, setName] = useState('');

    function handleClose() {
        setOpenPreferences(false);
        setEditing(false);
        setConfirmingDelete(false);
        setName('');
    }

    async function handleRename(e) {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 3) return;
        try {
            await updateWorkspaceMutation({ name: trimmed });
            queryClient.invalidateQueries({
                queryKey: [`fetchWorkspaceById-${workspaceId}`]
            });
            queryClient.invalidateQueries({ queryKey: ['fetchWorkspaces'] });
            toast({ title: 'Workspace renamed' });
            setEditing(false);
        } catch (error) {
            toast({
                title: error?.message || 'Could not rename workspace',
                variant: 'destructive'
            });
        }
    }

    async function handleDelete() {
        try {
            await deleteWorkspaceMutation();
            queryClient.invalidateQueries({ queryKey: ['fetchWorkspaces'] });
            toast({ title: 'Workspace deleted' });
            handleClose();
            navigate('/home');
        } catch (error) {
            toast({
                title: error?.message || 'Could not delete workspace',
                variant: 'destructive'
            });
        }
    }

    return (
        <Dialog open={openPreferences} onOpenChange={handleClose}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>{initialValue}</DialogTitle>
                    <DialogDescription>
                        View and update your workspace preferences.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    {/* Workspace name section */}
                    <div className="px-5 py-4 bg-white rounded-lg border">
                        {editing ? (
                            <form onSubmit={handleRename} className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-gray-900">
                                    Workspace name
                                </label>
                                <Input
                                    required
                                    autoFocus
                                    minLength={3}
                                    disabled={isUpdating}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="New workspace name"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isUpdating}
                                        onClick={() => {
                                            setEditing(false);
                                            setName('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isUpdating || name.trim().length < 3}
                                    >
                                        {isUpdating ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-gray-900">
                                        Workspace name
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {initialValue}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(true);
                                        setName(initialValue || '');
                                    }}
                                    className="text-sm font-semibold text-[#1264A3] hover:underline"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Delete section */}
                    {confirmingDelete ? (
                        <div className="px-5 py-4 bg-white rounded-lg border border-red-200">
                            <p className="text-sm font-semibold text-gray-900">
                                Delete this workspace?
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                This action can&apos;t be undone. All channels and messages
                                will be permanently removed.
                            </p>
                            <div className="flex justify-end gap-2 mt-3">
                                <Button
                                    variant="outline"
                                    disabled={isDeleting}
                                    onClick={() => setConfirmingDelete(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete workspace'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmingDelete(true)}
                            className="flex items-center gap-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-left"
                        >
                            <Trash2Icon className="size-4 text-red-600" />
                            <p className="text-sm font-semibold text-red-600">
                                Delete workspace
                            </p>
                        </button>
                    )}
                </div>

                <DialogFooter className="p-4 bg-white border-t">
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
