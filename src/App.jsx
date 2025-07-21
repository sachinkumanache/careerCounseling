import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import "./App.css";
import ProfileForm from "./pages/ProfileForm";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import AddCounselor from "./pages/AddCounselor";
import CounselorList from "./pages/CounselorList";
import AdminCounselorPanel from "./pages/AdminCounselorPanel";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/add-counselor" element={<AddCounselor />} />
        <Route path="/counselors" element={<CounselorList />} />
        <Route path="/admin-counselors" element={<AdminCounselorPanel />} />
      </Routes>
    </>
  );
}
export default App;