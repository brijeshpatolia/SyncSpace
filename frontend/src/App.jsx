import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';

import { SigninContainer } from '@/components/organisms/Auth/SignInContainer';
import { SignUpContainer } from '@/components/organisms/Auth/SignUpContainer';
import { Toaster } from '@/components/ui/toaster';
import { Auth } from '@/pages/Auth/Auth';
import { Notfound } from '@/pages/Notfound/Notfound';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/auth/signup" element={<Auth><SignUpContainer /></Auth>} />

        <Route path="/auth/signin" element={<Auth><SigninContainer /></Auth>} />

        <Route path="/*" element={<Notfound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
