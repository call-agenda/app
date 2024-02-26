import { createBrowserRouter } from "react-router-dom";
import { Auth } from "./pages/auth";
import { Register } from "./pages/auth/register";
import { UpdateProfile } from "./pages/auth/register/update-profile";
import { Home } from "./pages/app";

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <></>,
    children: [
      {
        path: '/',
        element: <Auth />
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/update-profile',
        element: <UpdateProfile />
      }
    ]
  },
  {
    path: '/',
    // element
    errorElement: <></>,
    children: [
      {
        path: '/home',
        element: <Home />
      }
    ]
  }
])