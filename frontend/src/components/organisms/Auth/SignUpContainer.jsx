import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSignUp } from '@/hooks/apis/auth/useSignup';

import { SignUpCard } from './SignupCard';


export const SignUpContainer = () => {
    const navigate = useNavigate();

    const [signupForm, setSignupForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });
    const [validationError, setValidationError] = useState(null);

    const {
        isPending,
        isSuccess,
        error,
        signupMutation
    } = useSignUp();

    async function onSignupFormSubmit(e) {
        e.preventDefault();
        console.log('Signup form submitted:', signupForm);
        if (!signupForm.email || !signupForm.password || !signupForm.confirmPassword || !signupForm.username) {
            setValidationError({ message: 'All fields are required' });
            return;
        }
        if (signupForm.password !== signupForm.confirmPassword) {
            setValidationError({ message: 'Passwords do not match' });
            return;

        }
        setValidationError(null);

        await signupMutation({
            email: signupForm.email,
            password: signupForm.password,
            username: signupForm.username
        });
        
    }
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                navigate('/auth/signin');
            }, 3000);
        }

    }, [isSuccess, navigate]);

    return (
        <SignUpCard
            error={error}
            isPending={isPending}
            isSuccess={isSuccess}
            signupForm={signupForm}
            setSignupForm={setSignupForm}
            validationError={validationError}
            onSignupFormSubmit={onSignupFormSubmit}
        />
    );
};