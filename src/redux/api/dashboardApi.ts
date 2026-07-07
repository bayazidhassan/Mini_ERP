import { baseApi } from './baseApi';

export type TLowStockProduct = {
  _id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  sellingPrice: number;
  image: string;
};

export type TDashboardResponse = {
  success: boolean;
  message: string;
  data: {
    totalProducts: number;
    totalSales: number;
    lowStockProducts: TLowStockProduct[];
  };
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<TDashboardResponse, void>({
      query: () => ({
        url: '/dashboard',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
