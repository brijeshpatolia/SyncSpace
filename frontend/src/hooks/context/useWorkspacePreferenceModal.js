import { useContext } from 'react';

import workspacePreferenceModalContext from '@/context/WorkspacePreferenceModalContext';

export const useWorkspacePreferenceModal = () => {
    return useContext(workspacePreferenceModalContext);
};