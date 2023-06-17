import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Banks, Login, Register } from '../pages';
import { appRoutes } from '../constants';
import { useAppSelector } from '../hooks';
import { authSelectors } from '../state/ducks/auth';

const PrivateRoute = () => {
  const { token } = useAppSelector(authSelectors.auth).auth;
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to={appRoutes.LOGIN} replace />;
  }
};

const PublicRoute = () => {
  const { token } = useAppSelector(authSelectors.auth).auth;
  if (!token) {
    return <Outlet />;
  } else {
    return <Navigate to={appRoutes.BANKS} replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route element={<Banks />} path={appRoutes.BANKS} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route element={<Register />} path={appRoutes.REGISTER} />
        <Route element={<Login />} path={appRoutes.LOGIN} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
