import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateProductMutation } from '@/redux/api/productApi';
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
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/getErrorMessage';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    stockQuantity: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState('');

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

    if (!imageFile) {
      setError('Product image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('sku', form.sku);
    formData.append('category', form.category);
    formData.append('purchasePrice', form.purchasePrice);
    formData.append('sellingPrice', form.sellingPrice);
    formData.append('stockQuantity', form.stockQuantity);
    formData.append('image', imageFile);

    try {
      await createProduct(formData).unwrap();
      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create product.'));
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
          <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
          <p className="text-sm text-gray-500">
            Create a new product in your inventory
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
                placeholder="e.g. Wireless Mouse"
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
                  placeholder="e.g. WM-001"
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
                  placeholder="e.g. Electronics"
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
                  placeholder="0.00"
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
                  placeholder="0.00"
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
                  placeholder="0"
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
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/50"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to a few MB
                    </p>
                  </>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
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
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;
