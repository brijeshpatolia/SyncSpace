import { useMutation } from '@tanstack/react-query';

import { signUpRequest } from '@/apis/auth';


export const useSignUp = () => {
    const { isPending, isSuccess, error, mutate: signupMutation } = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => console.log('SignUp successful', data),
        onError: (error) => console.error('SignUp failed', error)
    });
    return {
        isPending,
        isSuccess,
        error,
        signupMutation
    };
};
