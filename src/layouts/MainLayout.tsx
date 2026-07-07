import { LayoutDashboard, LogOut, Package, ShoppingCart } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { logout } from '../redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hook';

const MainLayout = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
        <div className="flex items-center gap-2 p-6 border-b border-gray-200">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-2xl font-bold text-blue-600 transition-opacity hover:opacity-80"
          >
            <Package className="h-7 w-7" />
            Mini ERP
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            <Package className="h-5 w-5" />
            Products
          </NavLink>

          <NavLink to="/sales/create" className={navLinkClass}>
            <ShoppingCart className="h-5 w-5" />
            Create Sale
          </NavLink>
        </nav>
      </aside>

      {/* Right Section */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            Inventory & Sales Management
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500 hover:text-white hover:border-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
