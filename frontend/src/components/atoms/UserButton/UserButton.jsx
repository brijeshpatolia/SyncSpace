import { LogOutIcon, PencilIcon, SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/context/useAuth';
import { useCreateWorkspaceModal } from '@/hooks/context/useCreateWorkspaceModal';
import { useToast } from '@/hooks/use-toast';

export const UserButton = () => {
    const navigate = useNavigate();
    const { auth, logout } = useAuth();
    const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal();
    const { toast } = useToast();
    function handleCreateWorkspace() {
        setOpenCreateWorkspaceModal(true);
    }
    async function handleLogout() {
        await logout();
        toast({
            title: 'logged out successfully',
            message: 'You will be redirected to the login page in a few seconds',
            type: 'success',
        });
        navigate('/auth/signin');
    }
    const initials = auth?.user?.username
        ?.split('')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-65'>
                    <AvatarImage src={auth?.user?.avatar} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick = {handleCreateWorkspace}>
                    <PencilIcon className='size-4 mr-2 h-10' />
                    create workspace
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsIcon className='size-4 mr-2 h-10' />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className='size-4 mr-2 h-10' />
                    Logout

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
