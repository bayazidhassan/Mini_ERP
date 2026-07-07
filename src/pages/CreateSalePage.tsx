import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useCreateSaleMutation } from '@/redux/api/saleApi';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '../utils/getErrorMessage';

type TSaleItem = {
  product: string;
  name: string;
  sellingPrice: number;
  availableStock: number;
  quantity: number;
};

const CreateSalePage = () => {
  const navigate = useNavigate();

  const [productSearch, setProductSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({ page: 1, limit: 100, search: productSearch });

  const [createSale, { isLoading: creating }] = useCreateSaleMutation();

  const [selectedItems, setSelectedItems] = useState<TSaleItem[]>([]);
  const [error, setError] = useState('');

  const products = productsData?.data || [];

  const availableProducts = products.filter(
    (p) => !selectedItems.some((item) => item.product === p._id),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    setSelectedItems([
      ...selectedItems,
      {
        product: product._id,
        name: product.name,
        sellingPrice: product.sellingPrice,
        availableStock: product.stockQuantity,
        quantity: 1,
      },
    ]);
    setError('');
    setProductSearch('');
    setShowDropdown(false);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedItems((items) =>
      items.map((item) =>
        item.product === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemove = (productId: string) => {
    setSelectedItems((items) =>
      items.filter((item) => item.product !== productId),
    );
  };

  const grandTotal = selectedItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0,
  );

  const handleSubmit = async () => {
    setError('');

    if (selectedItems.length === 0) {
      setError('Add at least one product.');
      return;
    }

    for (const item of selectedItems) {
      if (item.quantity < 1) {
        setError(`Quantity for ${item.name} must be at least 1.`);
        return;
      }
      if (item.quantity > item.availableStock) {
        setError(
          `Insufficient stock for ${item.name}. Available: ${item.availableStock}`,
        );
        return;
      }
    }

    try {
      await createSale({
        products: selectedItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      }).unwrap();

      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create sale.'));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create Sale</h1>

      <div className="space-y-2 relative" ref={searchContainerRef}>
        <Label htmlFor="productSearch">Add Product</Label>
        <Input
          id="productSearch"
          placeholder="Search product by name or SKU..."
          value={productSearch}
          onChange={(e) => {
            setProductSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full max-h-64 overflow-auto rounded-md border bg-background shadow-md">
            {productsLoading && (
              <p className="p-3 text-sm text-muted-foreground">Loading...</p>
            )}

            {!productsLoading && availableProducts.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">
                No products found.
              </p>
            )}

            {!productsLoading &&
              availableProducts.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => handleAddProduct(product._id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span>{product.name}</span>
                  <span className="text-muted-foreground">
                    Stock: {product.stockQuantity} · ৳{product.sellingPrice}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedItems.map((item) => (
                <TableRow key={item.product}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>৳{item.sellingPrice}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      max={item.availableStock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product,
                          Number(e.target.value),
                        )
                      }
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>৳{item.sellingPrice * item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(item.product)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-lg font-semibold">Grand Total: ৳{grandTotal}</p>
        <Button onClick={handleSubmit} disabled={creating}>
          {creating ? 'Creating Sale...' : 'Create Sale'}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default CreateSalePage;
