import { baseApi } from './baseApi';

export type TCreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'employee';
};

export type TUserResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<TUserResponse, TCreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateUserMutation } = userApi;
