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
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        {canManageProducts && (
          <Button onClick={() => navigate('/products/add')}>Add Product</Button>
        )}
      </div>

      <Input
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      {isLoading && <p>Loading products...</p>}
      {isError && <p className="text-destructive">Failed to load products.</p>}
      {!isLoading && !isError && products.length === 0 && (
        <p className="text-muted-foreground">No products found.</p>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Stock</TableHead>
                {canManageProducts && (
                  <TableHead className="text-center">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.purchasePrice}</TableCell>
                  <TableCell>{product.sellingPrice}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stockQuantity < 5
                          ? 'text-destructive font-semibold'
                          : ''
                      }
                    >
                      {product.stockQuantity}
                    </span>
                  </TableCell>
                  {canManageProducts && (
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/products/edit/${product._id}`, {
                            state: { product },
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product._id)}
                      >
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
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= meta.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
