import { baseApi } from '@/redux/api/baseApi';

export type TSaleProduct = {
  product: string;
  quantity: number;
  priceAtSale: number;
};

export type TSale = {
  _id: string;
  products: TSaleProduct[];
  grandTotal: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TCreateSaleRequest = {
  products: {
    product: string;
    quantity: number;
  }[];
};

export type TSaleResponse = {
  success: boolean;
  message: string;
  data: TSale;
};

export const saleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation<TSaleResponse, TCreateSaleRequest>({
      query: (body) => ({
        url: '/sales',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product', 'Dashboard'],
    }),
  }),
});

export const { useCreateSaleMutation } = saleApi;
