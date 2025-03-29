import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/toaster';
import { AppRoutes } from '@/Routes';

import { AuthContextProvider } from './context/AuthContext';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AppRoutes />
        <Toaster />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
