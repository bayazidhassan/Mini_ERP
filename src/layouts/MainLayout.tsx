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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            Mini ERP
          </Link>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          <NavLink to="/dashboard">Dashboard</NavLink>

          <NavLink to="/products">Products</NavLink>

          <NavLink to="/sales/create">Create Sale</NavLink>
        </nav>
      </aside>

      {/* Right Section */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Inventory & Sales Management
          </h1>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
