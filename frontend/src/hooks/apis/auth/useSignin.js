'use client';

import { useMutation } from '@tanstack/react-query';

import { signInRequest } from '@/apis/auth';
import { useAuth } from '@/hooks/context/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useSignin = () => {
    const { toast } = useToast();
    const { setAuth } = useAuth();

    const {
        isPending,
        isSuccess,
        error,
        mutateAsync: signinMutation,
    } = useMutation({
        mutationFn: signInRequest,
        onSuccess: (response) => {
            console.log('Successfully signed in', response);

            // Correct destructuring
            const { token, user } = response.data;

            // Save user and token properly
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            setAuth({
                token: token,
                user: user,
                loading: false,
            });

            toast({
                title: 'Successfully signed in',
                message: 'You will be redirected to the home page in a few seconds',
                type: 'success',
            });
        },
        onError: (error) => {
            console.error('Failed to sign in', error);
            toast({
                title: 'Failed to sign in',
                message: error.message,
                type: 'error',
                variant: 'destructive',
            });
        },
    });

    return {
        isPending,
        isSuccess,
        error,
        signinMutation,
    };
};
