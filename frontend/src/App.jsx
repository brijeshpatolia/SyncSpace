import './App.css';

import { Route, Routes } from 'react-router-dom';

import { SignInCard } from '@/components/organisms/Auth/SigninCard';
import { SignUpCard } from '@/components/organisms/Auth/SignupCard';
import { Auth } from '@/pages/Auth/Auth';
import { Notfound } from '@/pages/Notfound/Notfound';

function App() {
  return (
    <Routes>
      <Route path="/auth/signup" element={<Auth><SignUpCard /></Auth>} />

      <Route path="/auth/signin" element={<Auth><SignInCard /></Auth>} />

      <Route path="/*" element = {<Notfound />} />
    </Routes>
  );
}

export default App;
