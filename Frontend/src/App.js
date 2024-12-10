import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginComponent from "./Sites/LoginComponent.js";
import Home from "./Sites/Home.js";
import ForgetPasswordPage from "./Sites/ForgetPassword.js";
import RegisterPage from "./Sites/RegisterPage.js";

import { useEffect } from "react"
import ProfilePage from "./Sites/ProfilePage";

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
                  <Route path="profilePage" element={<ProfilePage/>}/>
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
