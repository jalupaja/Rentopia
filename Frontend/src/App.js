import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSite from "./sites/Login.js";
import HomeSite from "./sites/Home.js";
import DeviceSite from "./sites/Device.js";
import ForgetPasswordSite from "./sites/ForgetPassword.js";
import RegisterSite from "./sites/Register.js";

import { useEffect } from "react"

function App() {
    return (
        <BrowserRouter sx={{ width: "100%", Height: "100%" }}>
            <Routes>
                <Route path="/" >
                    <Route index element={<HomeSite />} />
                    <Route path="login" element={<LoginSite />} />
                    <Route path="resetPassword" element={<ForgetPasswordSite />} />
                    <Route path="register" element={<RegisterSite />} />
                </Route>
                <Route path="device" >
                    <Route index element={<Navigate to="/" />} /> // return to the Home site
                    <Route path=":deviceId" element={<DeviceSite />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
