import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginSite from "./sites/Login.js";
import HomeSite from "./sites/Home.js";
import ForgetPasswordSite from "./sites/ForgetPassword.js";
import RegisterSite from "./sites/Register.js";

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
          </Routes>
      </BrowserRouter>
  );
}

export default App;
