import { InfoIcon, LucideLoader2, SearchIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';

export const WorkspaceNavbar = () => {

    const { workspaceId } = useParams();
    const { isLoading, workspace } = useGetWorkspaceById(workspaceId);
    console.log(workspace);

    if (isLoading) {
        return <LucideLoader2 className="animate-spin ml-2" />;
    }



    return (
        <nav className='flex items-center justify-center h-10 p-1.5 bg-slack-dark'>
            <div className='flex-1' />
            <div>
                <Button
                    size='sm'
                    className='bg-accent/25 hover:bg-accent/15 w-full justify-start h-7 px-2' >
                    <SearchIcon className='size-5 text-white mr-2' />
                    <span className='text-white text-xs'>
                        Search {workspace?.name || 'workspace'}
                    </span>
                </Button>
            </div>
            <div className='ml-auto flex-1 flex item-center justify-end'>
                <Button
                    variant='transparent'
                    size='iconSm'>

                    <InfoIcon className='size-5 text-white' />

                </Button>
            </div>

        </nav>
    );
};