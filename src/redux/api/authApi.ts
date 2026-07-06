import { baseApi } from './baseApi';

type TLoginRequest = {
  email: string;
  password: string;
};

type TLoginResponse = {
  success: boolean;
  message: string;
  data: {
    safeUser: {
      _id: string;
      name: string;
      email: string;
      role: 'admin' | 'manager' | 'employee';
    };
    accessToken: string;
  };
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TLoginResponse, TLoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
