import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FacultyDashboardPage from "./pages/FacultyDashboardPage";
import FacultyAttendancePage from "./pages/FacultyAttendancePage";
import ManageUsersPage from "./pages/ManageUsersPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import ProtectedFacultyRoute from "./routes/ProtectedFacultyRoute";
import FacultyTimetablePage from "./pages/FacultyTimetablePage";
import ManageTimetablePage from "./pages/ManageTimetablePage";
import ReportsPage from "./pages/ReportsPage";
import UploadStudentDataPage from "./pages/UploadStudentDataPage";
import StudentMissedClassesPage from "./pages/StudentMissedClassesPage";
import FacultyReportsPage from "./pages/FacultyReportsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/manage-users" element={<ManageUsersPage />} />
        <Route path="/admin/manage-timetable" element={<ManageTimetablePage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/upload-students" element={<UploadStudentDataPage />} />

        <Route
          path="/faculty"
          element={       
            // this will protect from direct link access
            <ProtectedFacultyRoute>
              <FacultyDashboardPage />
            </ProtectedFacultyRoute>
          }
        />   
        <Route path="/faculty/reports" element={<FacultyReportsPage />} />
        <Route path="/faculty/attendance" element={<FacultyAttendancePage />} />
        <Route path="/student" element={<StudentDashboardPage />} />
        <Route path="/student/missed" element={<StudentMissedClassesPage />} />
        <Route path="/faculty/timetable" element={<FacultyTimetablePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;