import { createBrowserRouter } from 'react-router';
import LoginPage from '../pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
]);

export default router;
