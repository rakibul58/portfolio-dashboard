import { TQueryParam } from "@/Types";
import { baseApi } from "../../api/baseApi";

const educationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducations: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            if (item.value !== null)
              params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/educations",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["education"],
    }),

    addEducation: builder.mutation({
      query: (educationData) => ({
        url: `/educations`,
        method: "POST",
        body: educationData,
      }),
      invalidatesTags: ["education"],
    }),

    updateEducation: builder.mutation({
      query: (payload) => ({
        url: `/educations/${payload.id}`,
        method: "PUT",
        body: payload.educationData,
      }),
      invalidatesTags: ["education"],
    }),

    deleteEducation: builder.mutation({
      query: (id: string) => ({
        url: `/educations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["education"],
    }),
  }),
});

export const {
  useGetEducationsQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationApi;
