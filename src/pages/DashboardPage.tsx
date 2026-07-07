import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { socket } from '@/lib/socket';
import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';
import {
  useGetDashboardStatsQuery,
  type TLowStockProduct,
} from '../redux/api/dashboardApi';

const DashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery();

  useEffect(() => {
    socket.connect();

    socket.on(
      'lowStock',
      (alert: { productId: string; name: string; stockQuantity: number }) => {
        console.log('Low stock alert:', alert);
        refetch();
      },
    );

    return () => {
      socket.off('lowStock');
      socket.disconnect();
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const stats = data?.data;
  const lowStockCount = stats?.lowStockProducts?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Inventory & Sales Overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="border-blue-100 bg-blue-50/50 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Products
            </CardTitle>
            <div className="rounded-full bg-blue-100 p-2">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-900">
              {stats?.totalProducts}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50/50 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total Sales
            </CardTitle>
            <div className="rounded-full bg-green-100 p-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-900">
              {stats?.totalSales}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/50 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Low Stock Items
            </CardTitle>
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-900">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Low Stock Products
          </CardTitle>
        </CardHeader>

        <CardContent>
          {lowStockCount === 0 ? (
            <p className="py-6 text-center text-gray-500">
              No low stock products. Everything looks well stocked.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-3 font-medium">Image</th>
                    <th className="py-3 font-medium">Product</th>
                    <th className="py-3 font-medium">SKU</th>
                    <th className="py-3 font-medium">Price</th>
                    <th className="py-3 font-medium">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {stats?.lowStockProducts.map((product: TLowStockProduct) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="py-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        />
                      </td>

                      <td className="font-medium text-gray-800">
                        {product.name}
                      </td>

                      <td className="text-gray-500">{product.sku}</td>

                      <td className="text-gray-700">${product.sellingPrice}</td>

                      <td>
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          {product.stockQuantity} left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
