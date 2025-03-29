import axios from '@/config/axiosConfig';


export const fetchWorkspacesRequest = async ({ token }) => {
    try {
        const response = await axios.get('/list', {
            headers: {
                'x-access-token': token
            }
        });
        console.log('Response in fetch workspace request', response);
        return response?.data?.data;

    } catch (error) {
        console.log('Error in fetching workspace request', error);
        throw error.response.data;
    }
};