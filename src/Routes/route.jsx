import { createBrowserRouter } from "react-router-dom";
import NewsPage from "../Pages/NewsPage";
import MainRoute from "../Pages/MainRoute";
import LibraryPage from "../Pages/LibraryPage";
import CalculatorPage from "../Pages/CalculatorPage";
import ServicesPage from "../Pages/ServicesPage";
import HomePage from "../Pages/Homepage";
import AboutPage from "../Pages/About";
import AdminHomePage from "../Pages/AdminHomePage";
import AdminMainRoute from "../Pages/AdminMainRoute";
import AdminNewsPage from "../Pages/AdminNewsPage";
import AdminLibraryPage from "../Pages/AdminLibraryPage";
import AdminServicesPage from "../Pages/AdminServicesPage";
import AdminUsersPage from "../Pages/AdminUsersPage";
import AddNewsPage from "../Pages/AddNewsPage";
import AddBookPage from "../Pages/AddBookPage";
import AddServicePage from "../Pages/AddServicePage";
import AddUserPage from "../Pages/AddUserPage";
import AdminProfilePage from "../Pages/AdminProfilePage";
import LoginPage from "../Pages/LoginPage";
import ProfilPage from "../Pages/ProfilPage";
import AdminLoginPage from "../Pages/AdminLoginPage";
import RegisterPage from "../Pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRoute />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "library/:category",
        element: <LibraryPage />,
      },
      {
        path: "calculator",
        element: <CalculatorPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "profile",
        element: <ProfilPage />,
      },
    ],
  },
  {
    path: "/admin/",
    element: <AdminMainRoute />,
    children: [
      {
        path: "",
        element: <AdminHomePage />,
      },
      {
        path: "news",
        element: <AdminNewsPage />,
      },
      {
        path: "library",
        element: <AdminLibraryPage />,
      },
      {
        path: "services",
        element: <AdminServicesPage />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "add-news",
        element: <AddNewsPage />,
      },
      {
        path: "add-book",
        element: <AddBookPage />,
      },
      {
        path: "add-service",
        element: <AddServicePage />,
      },
      {
        path: "add-user",
        element: <AddUserPage />,
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
]);

export default router;
