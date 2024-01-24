import {createBrowserRouter, RouterProvider} from "react-router-dom"
import DoctorHome from "./DoctorHome";
import CardProfile from "./CardProfile";
import Login from "./Login";
import Profile from "./Profile";

const Router = () => {

    const router = createBrowserRouter([
        {
          path: "/",
          element: <Login/>,
        },
        {
            path: "/home",
            element: <Profile/>,
        },
        {
            path: "/doctorhome",
            element: <DoctorHome/>,
        },
      ]);

      return (
      <>
      <RouterProvider router={router} />
      </>
      )
}

export default Router
