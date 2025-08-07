import { AlertTriangleIcon, Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { WorkspacePanelHeader } from '@/components/molecules/Workspace/WorkspacePanelHeader';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';

export const WorkspacePanel = () => {
    const { workspaceId } = useParams();
    const{isfetching, workspace , isSuccess} = useGetWorkspaceById(workspaceId);

    if (isfetching) {
        return(
             <div className='flex flex-col gap-y-2 h-full items-center justify-center text-white'>
                 <Loader className="animate-spin size-6 text-white" />;
             </div>
        );
    }

    if(!isSuccess){
        return (
            <div className='flex flex-col gap-y-2 h-full items-center justify-center text-white'>
                <AlertTriangleIcon className="h-6 w-6 text-red-500" />
                An error occurred while fetching the workspace. Please try again later.
 
            </div>
        );

    }

    return (
    <div className='flex flex-col h-full bg-slack-medium'>
        <WorkspacePanelHeader workspace={workspace} />
    </div>
  );
};