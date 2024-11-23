
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginComponent from "./components/LoginComponent.js";
import Home from "./components/Home.js";
import ForgetPasswordPage from "./components/ForgetPassword.js";
import RegisterPage from "./components/RegisterPage.js";

import { useEffect } from "react"

function App() {
    useEffect(() => {
        document.title = "Rentopia"
    }, [])

  return (
      <BrowserRouter sx = {{    width : "100%", Height : "100%"}}>
          <Routes>
              <Route path="/" >
                  <Route index element={<Home />} />
                  <Route path="login" element={<LoginComponent />} />
                  <Route path="forgetPasword" element={<ForgetPasswordPage/>}/>
                  <Route path="register" element={<RegisterPage/>}/>
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
