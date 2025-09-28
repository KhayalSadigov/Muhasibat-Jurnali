import { createBrowserRouter } from "react-router-dom";
// import HomePage from "../Pages/Homepage";
import NewsPage from "../Pages/NewsPage";
import MainRoute from "../Pages/MainRoute";
import LibraryPage from "../Pages/LibraryPage";
import CalculatorPage from "../Pages/CalculatorPage";
import ServicesPage from "../Pages/ServicesPage";
import HomePage from "../Pages/Homepage";
import AboutPage from "../Pages/About";

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
    ],
  },
]);

export default router;
