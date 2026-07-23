import axios from '@/config/axiosConfig';

export const getMessagesRequest = async ({ channelId, token, page = 1, limit = 50 }) => {
    try {
        const response = await axios.get(`/messages/${channelId}`, {
            params: { page, limit },
            headers: {
                'x-access-token': token
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.log('Error in get messages request', error);
        throw error?.response?.data ?? error;
    }
};

export const createMessageRequest = async ({ channelId, body, image, token }) => {
    try {
        const response = await axios.post(
            `/messages/${channelId}`,
            { body, image },
            {
                headers: {
                    'x-access-token': token
                }
            }
        );
        return response?.data?.data;
    } catch (error) {
        console.log('Error in create message request', error);
        throw error?.response?.data ?? error;
    }
};
