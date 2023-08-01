import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import Profile from "./Profile";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Dashboard />} />
      <Route exact path="/transactions" element={<Transactions />} />
      <Route exact path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
);

export default App;
