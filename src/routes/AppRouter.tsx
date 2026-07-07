import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import AddProductPage from '../pages/AddProductPage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ProductListPage from '../pages/ProductListPage';
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
      {
        path: 'products',
        Component: ProductListPage,
      },
      {
        Component: () => <ProtectedRoute allowedRoles={['admin', 'manager']} />,
        children: [
          {
            path: 'products/add',
            Component: AddProductPage,
          },
        ],
      },
    ],
  },
]);

export default router;
