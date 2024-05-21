import { Layout } from "../Layout/Layout";
import Homepage from "../pages/Homepage/Home/Homepage";
import View from "../pages/ViewImage/view/View";
// import ViewImage from "../pages/ViewImage"

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
    children: [
      {
        path: '',
        element: <view/>,
      }
    ]
  }
]