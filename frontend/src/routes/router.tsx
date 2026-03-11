import { createBrowserRouter } from "react-router-dom";


import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import Landing from "../pages/Landing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:id",
    element: <ProductDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);
