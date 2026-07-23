import { useContext } from 'react';

import InviteMemberModalContext from '@/context/InviteMemberModalContext';

export const useInviteMemberModal = () => {
    return useContext(InviteMemberModalContext);
};
