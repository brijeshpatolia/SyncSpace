import combineContext from '@/utils/combineContext';

import { AuthContextProvider } from './AuthContext';
import { CreateChannelContextProvider } from './CreateChannelContext';
import { CreateWorkspaceContextProvider } from './CreateWorkspaceContext';
import { InviteMemberModalProvider } from './InviteMemberModalContext';
import { SocketContextProvider } from './SocketContext';
import { WorkspacePreferenceModalProvider } from './WorkspacePreferenceModalContext';

export const AppContextProvider = combineContext(
    AuthContextProvider,
    CreateWorkspaceContextProvider,
    WorkspacePreferenceModalProvider,
    CreateChannelContextProvider,
    InviteMemberModalProvider,
    SocketContextProvider
);