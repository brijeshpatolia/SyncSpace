import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, ListFilterIcon, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/context/useAuth';

export const WorkspacePanelHeader = ({workspace}) => {
    const workspacemembers = workspace?.members ;
    console.log(workspacemembers);
    const {auth} = useAuth();
    console.log(auth.user._id);
    const isLoggedInUserAdminofWorkspace = workspacemembers?.find(member => member.memberId === auth?.user?._id && member.role === 'Admin');
    console.log(isLoggedInUserAdminofWorkspace);
 return (
    <div className="flex items-center justify-between px-4 h-[50px] gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant='transparent'
                    className='font-semibold text-lg text-white p-2 rounded-md hover:bg-white/10 transition-colors'>
                    <span className='truncate'>
                    {workspace.name}
                    </span>
                    <ChevronDownIcon className="size-5 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className='w-64 bg-white rounded-lg border border-gray-200 shadow-lg p-1'>
                <DropdownMenuItem className='flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors'>
                 <div className='size-10 relative overflow-hidden text-white font-semibold text-xl rounded-md flex items-center justify-center bg-[#616061] flex-shrink-0'>
                      {workspace?.name.charAt(0).toUpperCase()}
                 </div>
                 <div className='flex flex-col items-start gap-1'>
                    <p className='font-semibold text-gray-900'>
                        {workspace?.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                        Active workspace
                    </p>
                 </div>
                </DropdownMenuItem>
                {isLoggedInUserAdminofWorkspace && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors'>
                            Preferences
                        </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors'>
                            Invite member to {workspace?.name}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
        <div className='flex items-center gap-1'>
            <Button 
                variant='transparent' 
                size='icon' 
                className='p-2 rounded-md hover:bg-white/10 transition-colors'>
                <ListFilterIcon className='size-5 text-white'/>
            </Button>
            <Button 
                variant='transparent' 
                size='icon' 
                className='p-2 rounded-md hover:bg-white/10 transition-colors'>
                <Edit className='size-5 text-white'/>
            </Button>
        </div>
    </div>
 );
};