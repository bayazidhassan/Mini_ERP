import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TProduct } from '@/redux/api/productApi';
import { useUpdateProductMutation } from '@/redux/api/productApi';
import {
  ArrowLeft,
  Boxes,
  DollarSign,
  ImagePlus,
  Layers,
  Package,
  Tag,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../utils/getErrorMessage';

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const existingProduct = (location.state as { product?: TProduct })?.product;

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const [form, setForm] = useState({
    name: existingProduct?.name || '',
    sku: existingProduct?.sku || '',
    category: existingProduct?.category || '',
    purchasePrice: existingProduct?.purchasePrice?.toString() || '',
    sellingPrice: existingProduct?.sellingPrice?.toString() || '',
    stockQuantity: existingProduct?.stockQuantity?.toString() || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    existingProduct?.image || '',
  );
  const [error, setError] = useState('');

  if (!existingProduct) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-red-600">
          No product data found. Please go back to the product list and try
          again.
        </p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('sku', form.sku);
    formData.append('category', form.category);
    formData.append('purchasePrice', form.purchasePrice);
    formData.append('sellingPrice', form.sellingPrice);
    formData.append('stockQuantity', form.stockQuantity);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await updateProduct({ id: id as string, body: formData }).unwrap();
      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update product.'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500">
            Update details for {existingProduct.name}
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-1.5 text-gray-700"
              >
                <Package className="h-4 w-4 text-gray-400" />
                Product Name
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="sku"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <Tag className="h-4 w-4 text-gray-400" />
                  SKU
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <Layers className="h-4 w-4 text-gray-400" />
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="purchasePrice"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  Purchase Price
                </Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  value={form.purchasePrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sellingPrice"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  Selling Price
                </Label>
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="stockQuantity"
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <Boxes className="h-4 w-4 text-gray-400" />
                  Stock Qty
                </Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="flex items-center gap-1.5 text-gray-700"
              >
                <ImagePlus className="h-4 w-4 text-gray-400" />
                Product Image
              </Label>

              <label
                htmlFor="image"
                className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt={existingProduct.name}
                    className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col items-center gap-1 text-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click to replace image
                  </p>
                  <p className="text-xs text-gray-400">
                    Leave unchanged to keep current image
                  </p>
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;
