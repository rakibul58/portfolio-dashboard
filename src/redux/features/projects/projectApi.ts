import { TQueryParam } from "@/Types";
import { baseApi } from "../../api/baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            if (item.value !== null)
              params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/projects",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["projects"],
    }),

    addProject: builder.mutation({
      query: (projectData) => ({
        url: `/projects`,
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["projects"],
    }),

    updateProject: builder.mutation({
      query: (payload) => ({
        url: `/projects/${payload.id}`,
        method: "PUT",
        body: payload.projectData,
      }),
      invalidatesTags: ["projects"],
    }),

    deleteProject: builder.mutation({
      query: (id: string) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["projects"],
    }),
  }),
});

export const {
  useAddProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
