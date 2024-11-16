import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from './pages/Loader/Loader.jsx';

const Login = React.lazy(() => import('./pages/Login/Login'));
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'));
const SignUp = React.lazy(() => import('./pages/SignUp/SignUp'));
const Layout = React.lazy(() => import('./layout/Layout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Storage = React.lazy(() => import('./pages/Storage/Storage'));
const Packages = React.lazy(() => import('./pages/Packages/Packages'));
const Profile = React.lazy(() => import('./pages/Profile/Profile.jsx'));

const App = () => {
  return (
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="dashboard/:type" element={<Storage />} />
          <Route path="packages" element={<Packages />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
