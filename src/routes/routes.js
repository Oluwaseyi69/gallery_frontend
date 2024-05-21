import { Layout } from "../Layout/Layout";
import Homepage from "../pages/Homepage/Home/Homepage";
import Hommme from "../pages/Homepage/Home/Hommme";
import View from "../pages/ViewImage/view/View";

export const ROUTES = [
  {
    path: "/",
    element: < Layout/>,
    children: [
      {
        path:"",
        element: < Homepage/>
      }
    ]
  },
  {
    path: '/view',
    element: <View/>,
    
  },
  {
    path: '/home',
    element: <Hommme/>,
  
  }
]