import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';


export const WorkspaceSwitcher = () => {
    const navigate = useNavigate();
    const {workspaceId} = useParams();
    const {isFetching , workspace} = useGetWorkspaceById(workspaceId);
    const{isFetching:isFetchingWorkspaces , workspaces} = useFetchWorkspace();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 font-semibold text-slate-800 text-xl">
                {isFetching ? (<Loader className="size-5 animate-spin" />) : workspace?.name?.charAt(0).toUpperCase() || 'W'}
                    
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                                <DropdownMenuItem className="!flex-col !items-start !justify-start !cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                   {workspace?.name}
                   <span className="text-xs text-muted-foreground ml-2">
                         (Active workspace)
                    </span>
                </DropdownMenuItem>
                {isFetchingWorkspaces ? (
                    <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100">
                        <Loader className="size-5 animate-spin" />
                    </DropdownMenuItem>
                ) : (
                                         workspaces
                         .filter((workspace) => workspace._id !== workspaceId)
                         .map((workspace) => (
                             <DropdownMenuItem 
                                 key={workspace._id} 
                                 className="!flex-col !items-start !justify-start !cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                 onClick={() => navigate(`/workspaces/${workspace._id}`)}
                             >
                                 {workspace.name}
                             </DropdownMenuItem>
                         ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};