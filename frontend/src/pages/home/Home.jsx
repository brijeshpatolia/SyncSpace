import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';

const Home = () => {
    const { isFetching, workspaces } = useFetchWorkspace();
    const navigate = useNavigate();
    useEffect(() => {
        if (isFetching) return;
        if (workspaces.length === 0) {
            console.log('No workspaces found');
        }else{
            console.log('Default workspace:', workspaces[0]);
            navigate(`/workspaces/${workspaces[0]._id}`); // Assuming first workspace is the default workspace
        }
    }, [isFetching, workspaces]);

    return (
        <>
            <div className='bg-slack'>
                HOME
                <UserButton />
            </div>


        </>
    );
};

export default Home;