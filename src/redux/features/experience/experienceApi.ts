import { TQueryParam } from "@/Types";
import { baseApi } from "../../api/baseApi";

const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperiences: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            if (item.value !== null)
              params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/experiences",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["experience"],
    }),

    addExperience: builder.mutation({
      query: (experienceData) => ({
        url: `/experiences`,
        method: "POST",
        body: experienceData,
      }),
      invalidatesTags: ["experience"],
    }),

    updateExperience: builder.mutation({
      query: (payload) => ({
        url: `/experiences/${payload.id}`,
        method: "PUT",
        body: payload.experienceData,
      }),
      invalidatesTags: ["experience"],
    }),

    deleteExperience: builder.mutation({
      query: (id: string) => ({
        url: `/experiences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["experience"],
    }),
  }),
});

export const {
  useGetExperiencesQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;
