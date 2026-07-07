import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TProduct } from '@/redux/api/productApi';
import { useUpdateProductMutation } from '@/redux/api/productApi';
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
      <div className="p-6">
        <p className="text-destructive">
          No product data found. Please go back to the product list and try
          again.
        </p>
        <Button className="mt-4" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      setError(getErrorMessage(err, 'Failed to create product.'));
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
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
          <Label htmlFor="sellingPrice">Selling Price</Label>
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
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            value={form.stockQuantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Replace Image (optional)</Label>
          <img
            src={previewUrl}
            alt={existingProduct.name}
            className="h-16 w-16 rounded object-cover mb-2"
          />
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Product'}
        </Button>
      </form>
    </div>
  );
};

export default EditProductPage;
