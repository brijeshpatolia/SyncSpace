import { WorkspaceSidebar } from '@/components/organisms/Workspace/WorkspaceSidebar';


export const WorkspaceLayout = ({ children }) => {
    return (
        <div className="h-[100vh]">
            <div className="flex h-[100vh]">
                <WorkspaceSidebar />
                {children}
            </div>
        </div>
    );
};
