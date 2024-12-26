import MainLayout from "@/components/layout/MainLayout";
import Error from "@/pages/Error";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AboutDashboard from "@/pages/Dashboard/AboutDashboard";
import BlogDashboard from "@/pages/Dashboard/BlogDashboard";
import ProjectDashboard from "@/pages/Dashboard/ProjectDashboard";
import ExperienceDashboard from "@/pages/Dashboard/ExperienceDashboard";
import EducationDashboard from "@/pages/Dashboard/EducationDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <SignIn />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/about",
        element: <AboutDashboard />,
      },
      {
        path: "/dashboard/blogs",
        element: <BlogDashboard />,
      },
      {
        path: "/dashboard/projects",
        element: <ProjectDashboard />,
      },
      {
        path: "/dashboard/experience",
        element: <ExperienceDashboard />,
      },
      {
        path: "/dashboard/education",
        element: <EducationDashboard />,
      },
    ],
  },
]);
