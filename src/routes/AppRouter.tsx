import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: MainLayout,
        children: [
          {
            path: 'dashboard',
            Component: DashboardPage,
          },
        ],
      },
    ],
  },
]);

export default router;
