import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/molecules/ProtectedRoute/ProtectedRoute';
import { SigninContainer } from '@/components/organisms/Auth/SignInContainer';
import { SignUpContainer } from '@/components/organisms/Auth/SignUpContainer';
import { Auth } from '@/pages/Auth/Auth';
import { Notfound } from '@/pages/Notfound/Notfound';

import Home from './pages/home/Home';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/signup" element={<Auth><SignUpContainer /></Auth>} />

            <Route path="/auth/signin" element={<Auth><SigninContainer /></Auth>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/*" element={<Notfound />} />
        </Routes>
    );
};