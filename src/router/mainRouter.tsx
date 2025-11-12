import Layout from "@/components/layout/Layout";
import Spinner from "@/components/Loading";
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectAdmin from "./ProtectAdmin";

export const Login = lazy(() => import("@/auth/LoginAdmin"));
export const Dashboard = lazy(() => import("@/components/pages/HomePages"));
export const User = lazy(() => import("@/components/screens/users/UsersPage"));
export const UserDetailed = lazy(
  () => import("@/components/screens/users/UserDetailed")
);
export const Rides = lazy(
  () => import("@/components/screens/rides/RidesPages")
);
export const Listing = lazy(
  () => import("@/components/screens/listing/Listing")
);
export const ListingDetailed = lazy(
  () => import("@/components/screens/listing/ListingDetailed")
);
export const CategoriesPage = lazy(
  () => import("@/components/screens/categories/CategoriesPage")
);
export const AddCategoryPage = lazy(
  () => import("@/components/screens/categories/AddCategoryPage")
);
export const Kyc = lazy(() => import("@/components/screens/kyc/KycPage"));
export const Reports = lazy(
  () => import("@/components/screens/reports/ReportsPage")
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/",
    element: <ProtectAdmin />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: withSuspense(Dashboard),
          },
          {
            path: "users",
            element: withSuspense(User),
          },
          {
            path: "users-detailed/:id",
            element: withSuspense(UserDetailed),
          },
          {
            path: "listing",
            element: withSuspense(Listing),
          },
          {
            path: "listings/:id",
            element: withSuspense(ListingDetailed),
          },
          {
            path: "rides",
            element: withSuspense(Rides),
          },
          {
            path: "kyc",
            element: withSuspense(Kyc),
          },
          {
            path: "categories",
            element: withSuspense(CategoriesPage),
          },
          {
            path: "categories/add",
            element: withSuspense(AddCategoryPage),
          },
          {
            path: "reports",
            element: withSuspense(Reports),
          },
        ],
      },
    ],
  },
]);
