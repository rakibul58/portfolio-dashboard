import { baseApi } from "../../api/baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => ({
        url: `/about`,
        method: "GET",
      }),
      providesTags: ["about"],
    }),

    updateAboutSection: builder.mutation({
      query: (payload) => ({
        url: `/about/section/${payload.section}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["about"],
    }),
    updateSkillsData: builder.mutation({
      query: (payload) => ({
        url: `/about/skills/${payload.category}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["about"],
    }),
  }),
});

export const { useGetAboutQuery, useUpdateAboutSectionMutation, useUpdateSkillsDataMutation } = aboutApi;
