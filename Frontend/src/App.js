import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginSite from "./sites/Login.js";
import HomeSite from "./sites/Home.js";
import ForgetPasswordSite from "./sites/ForgetPassword.js";
import RegisterSite from "./sites/Register.js";
import DeviceSite from "./sites/Device.js";
import { useEffect } from "react";
import ProfileSite from "./sites/Profile";
import HelpCenterSite from "./sites/HelpCenterSite.js";
import ChatSite from "./sites/Chat";

function App() {
    return (
        <BrowserRouter sx={{ width: "100%", Height: "100%" }}>
            <Routes>
                <Route path="/" >
                    <Route index element={<HomeSite />} />
                    <Route path="login" element={<LoginSite />} />
                    <Route path="resetPassword" element={<ForgetPasswordSite />} />
                    <Route path="register" element={<RegisterSite/>}/>
                    <Route path="helpCenter" element={<HelpCenterSite/>}/>
                    <Route path="helpCenter/ADM" element={<HelpCenterSite adm={true}/>}/>
                    <Route path="register" element={<RegisterSite />} />
                    <Route path="profilePage" element={<ProfileSite />} />
                    <Route path="chat" element={<ChatSite />} />
                </Route>
                <Route path="device" >
                    <Route index element={<Navigate to="/" />} /> // return to the Home page
                    <Route path=":deviceId" element={<DeviceSite />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
