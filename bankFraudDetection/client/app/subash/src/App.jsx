import { useState } from "react";
// Import necessary components from react-router-dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout"; // Layout for dashboard
import MainLayout from "./layout/MainLayout"; // Layout for landing page

// Import pages for the dashboard
import Form from "./pages/dashboard/Form";
import Dashboard from "./pages/dashboard/Dashboard";
import TransactionTable from "./pages/dashboard/TransactionTable";
import ExcelFileUpload from "./pages/dashboard/ExcelFileUpload";
import ProfileSetting from "./pages/dashboard/ProfileSetting";
import ChangePassword from "./pages/dashboard/ChangePassword";

// Import pages for the landing site
import Home from "./pages/web/Home";
import About from "./pages/web/About";
import Contact from "./pages/web/Contact";
import Login from "./pages/web/Login";
import Register from "./pages/web/Register";

function App() {
  const [ count, setCount ] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Landing Page Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes with DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form" element={<Form />} />
          <Route path="/transactionTable" element={<TransactionTable />} />
          <Route path="/excelFileUpload" element={<ExcelFileUpload />} />
          <Route path="/profileSetting" element={<ProfileSetting />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;