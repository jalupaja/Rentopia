import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginComponent from "./components/LoginComponent.js";
import Home from "./components/Home.js";
import ForgetPasswordPage from "./components/ForgetPassword.js";
import RegisterPage from "./components/RegisterPage.js";
import DevicePage from "./components/DevicePage.js";

import { useEffect } from "react"

function App() {
/*    useEffect(() => {
        document.title = "Rentopia"
    }, [])
*/
  return (
      <BrowserRouter sx = {{    width : "100%", Height : "100%"}}>
          <Routes>
              <Route path="/" >
                  <Route index element={<Home />} />
                  <Route path="login" element={<LoginComponent />} />
                  <Route path="resetPassword" element={<ForgetPasswordPage/>}/>
                  <Route path="register" element={<RegisterPage/>}/>
              </Route>
              <Route path="device" >
                  <Route index element={<Navigate to="/" />} /> // return to the Home page
                  <Route path=":deviceId" element={<DevicePage />} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
