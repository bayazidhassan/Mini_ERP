import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useGetDashboardStatsQuery,
  type TLowStockProduct,
} from '../redux/api/dashboardApi';

const DashboardPage = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load dashboard.</div>;
  }

  const stats = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Inventory & Sales Overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{stats?.totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{stats?.totalSales}</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>

        <CardContent>
          {stats?.lowStockProducts?.length === 0 ? (
            <p>No low stock products.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Image</th>
                    <th className="py-2 text-left">Product</th>
                    <th className="py-2 text-left">SKU</th>
                    <th className="py-2 text-left">Price</th>
                    <th className="py-2 text-left">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {stats?.lowStockProducts.map((product: TLowStockProduct) => (
                    <tr key={product._id} className="border-b">
                      <td className="py-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </td>

                      <td>{product.name}</td>

                      <td>{product.sku}</td>

                      <td>${product.sellingPrice}</td>

                      <td>
                        <span className="font-semibold text-red-500">
                          {product.stockQuantity}
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
