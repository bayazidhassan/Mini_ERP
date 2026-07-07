import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from '@/redux/api/productApi';
import {
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hook';

const ProductListPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { user } = useAppSelector((state) => state.auth);
  const canManageProducts = user?.role === 'admin' || user?.role === 'manager';

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    page,
    limit,
    search,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id).unwrap();
    } catch {
      alert('Failed to delete product.');
    }
  };

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            {meta
              ? `${meta.total} products in inventory`
              : 'Manage your inventory'}
          </p>
        </div>
        {canManageProducts && (
          <Button onClick={() => navigate('/products/add')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center text-gray-500">
          Loading products...
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Failed to load products.
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <PackageSearch className="h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-600">No products found</p>
          <p className="text-sm text-gray-400">
            Try a different search term
            {canManageProducts ? ' or add a new product' : ''}.
          </p>
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Stock</TableHead>
                {canManageProducts && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product._id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-gray-500">{product.sku}</TableCell>
                  <TableCell className="text-gray-600">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    ${product.purchasePrice}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    ${product.sellingPrice}
                  </TableCell>
                  <TableCell>
                    {product.stockQuantity < 5 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                        {product.stockQuantity} left
                      </span>
                    ) : (
                      <span className="text-gray-700">
                        {product.stockQuantity}
                      </span>
                    )}
                  </TableCell>
                  {canManageProducts && (
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() =>
                          navigate(`/products/edit/${product._id}`, {
                            state: { product },
                          })
                        }
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              disabled={page >= meta.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
