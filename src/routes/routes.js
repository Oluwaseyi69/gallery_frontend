import { Layout } from "../Layout/Layout";
import Invitation from "../pages/Invitation/Invitation";
import UploadPage from "../pages/Upload/UploadPage";
import View from "../pages/ViewImage/view/View";

export const ROUTES = [
  {
    path: "/",
    element: < Layout/>,
    children: [
      {
        path:"",
        element: <Invitation/>
      },
      {
        path: "upload",
        element: <UploadPage/>
      },
      {
        // Older links to the upload page used /home.
        path: "home",
        element: <UploadPage/>
      }
    ]
  },
  {
    path: '/view',
    element: <View/>,
  }
]
