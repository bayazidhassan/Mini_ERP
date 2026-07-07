import { baseApi } from '@/redux/api/baseApi';

export type TProduct = {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type TProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type TProductsResponse = {
  success: boolean;
  message: string;
  data: TProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type TProductResponse = {
  success: boolean;
  message: string;
  data: TProduct;
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Products
    getProducts: builder.query<TProductsResponse, TProductQuery>({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: '/products',
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ['Product'],
    }),

    // Get Product By Id
    getProductById: builder.query<TProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    // Create Product
    createProduct: builder.mutation<TProductResponse, FormData>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product', 'Dashboard'],
    }),

    // Update Product
    updateProduct: builder.mutation<
      TProductResponse,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        'Product',
        'Dashboard',
      ],
    }),

    // Delete Product
    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Dashboard'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
