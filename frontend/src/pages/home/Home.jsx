import { useEffect } from 'react';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';

const Home = () => {
    const {isFetching , workspaces} = useFetchWorkspace();

    useEffect(()=>{
        if(isFetching) return;
        if(workspaces.length === 0) console.log('No workspaces found');
    },[isFetching, workspaces]);

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