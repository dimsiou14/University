import {createBrowserRouter, RouterProvider} from "react-router-dom"
import DoctorHome from "./DoctorHome";
import CardProfile from "./CardProfile";
import Login from "./Login";

const Router = () => {

    const router = createBrowserRouter([
        {
          path: "/",
          element: <Login/>,
        },
        {
            path: "/home",
            element: <CardProfile/>,
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
