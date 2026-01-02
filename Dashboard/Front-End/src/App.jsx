import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import Header from "./components/header";
import DateTime from "./items/time";
import Footer from "./components/footer";

const App = () => {
  return (
    <>
      <div >
        <Router>
          <div className=" h-screen flex flex-col justify-between">
            <div>
              <div className="bg-white">
                <Header />
              </div>
              <DateTime></DateTime>
            </div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/setting" element={<SettingPage />} />
            </Routes>
            <div className=" bottom-0">
              <Footer></Footer>
            </div>
          </div>
        </Router>
      </div>
    </>
  );
};

export default App;
