import { Routes, Route, BrowserRouter } from "react-router-dom";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Các routes khác */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
