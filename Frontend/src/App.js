
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginComponent from "./components/LoginComponent.js";
import Home from "./components/Home.js";


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" >
                  <Route index element={<Home />} />
                  <Route path="login" element={<LoginComponent />} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
