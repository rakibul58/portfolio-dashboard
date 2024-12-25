import { TQueryParam } from "@/Types";
import { baseApi } from "../../api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            if (item.value !== null)
              params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/blogs",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["blogs"],
    }),

    addBlog: builder.mutation({
      query: (blogData) => ({
        url: `/blogs`,
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["blogs"],
    }),

    updateBlog: builder.mutation({
      query: (payload) => ({
        url: `/blogs/${payload.id}`,
        method: "PUT",
        body: payload.blogData,
      }),
      invalidatesTags: ["blogs"],
    }),

    deleteBlog: builder.mutation({
      query: (id: string) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
