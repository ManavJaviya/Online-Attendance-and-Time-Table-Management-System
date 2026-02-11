import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FacultyDashboardPage from "./pages/FacultyDashboardPage";
import FacultyAttendancePage from "./pages/FacultyAttendancePage";
import StudentDashboardPage from "./pages/StudentDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/faculty" element={<FacultyDashboardPage />} />
        <Route path="/faculty/attendance" element={<FacultyAttendancePage />} />
        <Route path="/student" element={<StudentDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
