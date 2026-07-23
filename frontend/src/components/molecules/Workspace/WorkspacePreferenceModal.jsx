import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';

export const WorkspacePreferenceModal = () => {
    const {initialValue , openPreferences ,setOpenPreferences}  = useWorkspacePreferenceModal();
    return (
        <Dialog open={openPreferences} onOpenChange={setOpenPreferences}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialValue}</DialogTitle>
                    <DialogDescription>
                        View and update your workspace preferences.
                    </DialogDescription>
                </DialogHeader>
                <div className='px-4 pb-4 flex flex-col gap-y-2'>
                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 '></div>
                </div>

            </DialogContent>
        </Dialog>
    );

};