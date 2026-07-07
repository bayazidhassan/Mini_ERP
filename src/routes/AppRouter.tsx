import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import AddProductPage from '../pages/AddProductPage';
import CreateSalePage from '../pages/CreateSalePage';
import DashboardPage from '../pages/DashboardPage';
import EditProductPage from '../pages/EditProductPage';
import LoginPage from '../pages/LoginPage';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';
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
          {
            path: 'products',
            Component: ProductListPage,
          },
          {
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'manager']} />
            ),
            children: [
              {
                path: 'products/add',
                Component: AddProductPage,
              },
              {
                path: 'products/edit/:id',
                Component: EditProductPage,
              },
            ],
          },
          {
            path: 'sales/create',
            Component: CreateSalePage,
          },
          {
            path: 'not-authorized',
            Component: NotAuthorizedPage,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]);

export default router;
