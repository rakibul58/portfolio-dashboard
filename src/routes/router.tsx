import MainLayout from "@/components/layout/MainLayout";
import Error from "@/pages/Error";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <SignIn />,
      }
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
      }
    ],
  }
]);
