import axios from '@/config/axiosConfig';

export const getChannelByIdRequest = async ({ channelId, token }) => {
    try {
        const response = await axios.get(`/channels/${channelId}`, {
            headers: {
                'x-access-token': token
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.log('Error in get channel by id request', error);
        throw error?.response?.data ?? error;
    }
};
