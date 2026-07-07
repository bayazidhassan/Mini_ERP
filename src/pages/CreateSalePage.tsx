import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { PackageX, Receipt, Search, ShoppingCart, Trash2 } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Sale</h1>
        <p className="text-sm text-gray-500">
          Search products, set quantities, and complete the sale
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2 relative" ref={searchContainerRef}>
            <Label
              htmlFor="productSearch"
              className="flex items-center gap-1.5 text-gray-700"
            >
              <Search className="h-4 w-4 text-gray-400" />
              Add Product
            </Label>
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
              <div className="absolute z-10 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {productsLoading && (
                  <p className="p-3 text-sm text-gray-500">Loading...</p>
                )}

                {!productsLoading && availableProducts.length === 0 && (
                  <div className="flex flex-col items-center gap-1 p-4 text-center">
                    <PackageX className="h-5 w-5 text-gray-300" />
                    <p className="text-sm text-gray-400">No products found.</p>
                  </div>
                )}

                {!productsLoading &&
                  availableProducts.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleAddProduct(product._id)}
                      className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2.5 text-left text-sm transition-colors last:border-0 hover:bg-blue-50"
                    >
                      <span className="font-medium text-gray-800">
                        {product.name}
                      </span>
                      <span className="text-gray-500">
                        Stock: {product.stockQuantity} · ৳{product.sellingPrice}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {selectedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-12 text-center">
              <ShoppingCart className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">No products added yet</p>
              <p className="text-xs text-gray-400">
                Search above to add products to this sale
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow key={item.product} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-800">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        ৳{item.sellingPrice}
                      </TableCell>
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
                      <TableCell className="font-medium text-gray-800">
                        ৳{item.sellingPrice * item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => handleRemove(item.product)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg bg-blue-50 border border-blue-100 px-5 py-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Receipt className="h-5 w-5" />
              <p className="text-lg font-semibold">
                Grand Total: ৳{grandTotal}
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={creating}
              className="gap-2"
            >
              {creating ? 'Creating Sale...' : 'Create Sale'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSalePage;
