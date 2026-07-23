import axios from '@/config/axiosConfig';


export const fetchWorkspacesRequest = async ({ token }) => {
    try {
        const response = await axios.get('/workspaces/list', {
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


export const createWorkspaceRequest = async ({ name, description, token }) => {

    try {
        const response = await axios.post('/workspaces/create', { name, description}, {
            headers: {
                'x-access-token': token
            }
        });
        console.log('Response in create workspace request', response);
        return response?.data?.data;

    } catch(error) {
        console.log('Error in create workspace request', error);
        throw error.response.data;
    }
};


export const fetchWorkspaceDetailsRequest = async ({ workspaceId, token }) => {
    try {
        const response = await axios.get(`/workspaces/${workspaceId}`, {
            headers: {
                'x-access-token': token
            }
        });
        console.log('Response in fetching workspace details request', response);
        return response?.data?.data;
    } catch(error) {
        console.log('Error in fetching workspace details request', error);
        throw error.response;
    }
};


export const addChannelToWorkspaceRequest = async ({ workspaceId, channelName, token }) => {
    try {
        const response = await axios.post(
            `/workspaces/${workspaceId}/add-channel`,
            { channelName },
            {
                headers: {
                    'x-access-token': token
                }
            }
        );
        return response?.data?.data;
    } catch (error) {
        console.log('Error in add channel to workspace request', error);
        throw error?.response?.data ?? error;
    }
};


export const updateWorkspaceRequest = async ({ workspaceId, name, token }) => {
    try {
        const response = await axios.put(
            `/workspaces/${workspaceId}/update`,
            { name },
            {
                headers: {
                    'x-access-token': token
                }
            }
        );
        return response?.data?.data;
    } catch (error) {
        console.log('Error in update workspace request', error);
        throw error?.response?.data ?? error;
    }
};


export const deleteWorkspaceRequest = async ({ workspaceId, token }) => {
    try {
        const response = await axios.delete(`/workspaces/${workspaceId}`, {
            headers: {
                'x-access-token': token
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.log('Error in delete workspace request', error);
        throw error?.response?.data ?? error;
    }
};