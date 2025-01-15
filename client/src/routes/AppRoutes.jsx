import AdminLayout from "@/admin/AdminLayout";
import DashboardAdmin from "@/admin/Dashboard/DashboardAdmin";
import ChangePasswordPage from "@/components/ChangePassword";
import ForgotPassword from "@/components/ForgotPassword";
import LoginForm from "@/components/LoginForm";
import ResetPassword from "@/components/ResetPassword";
import SignupForm from "@/components/SignUpForm";
import UserProfile from "@/components/UserProfile";
import HomePage from "@/pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import NotFoundPage from "@/pages/NotFoundPage";
import PublicRoute from "./PublicRoutes";
import UserList from "@/admin/User/UserList";
import UserDetail from "@/admin/User/UserDetail";
import SpecializationList from "@/admin/Doctor/Specializations/SpecializationList";
import AddSpecialization from "@/admin/Doctor/Specializations/AddSpecialization";
import UpdateSpecialization from "@/admin/Doctor/Specializations/UpdateSpecializations";
import DetailSpecialization from "@/admin/Doctor/Specializations/DetailSpecialization";
import DoctorList from "@/admin/Doctor/Doctor/DoctorList";
import DoctorDetail from "@/admin/Doctor/Doctor/DoctorDetail";
import UpdateDoctor from "@/admin/Doctor/Doctor/UpdateDoctor";
import ScheduleList from "@/admin/Doctor/Schedule/ScheduleList";
import ScheduleDetail from "@/admin/Doctor/Schedule/ScheduleDetail";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:userId" element={<UserDetail />} />
            <Route
              path="doctor/specializations"
              element={<SpecializationList />}
            />
            <Route
              path="doctor/specializations/create"
              element={<AddSpecialization />}
            />
            <Route
              path="doctor/specializations/update/:specializationId"
              element={<UpdateSpecialization />}
            />
            <Route
              path="doctor/specializations/:specializationId"
              element={<DetailSpecialization />}
            />{" "}
            <Route path="doctors" element={<DoctorList />} />
            <Route path="doctors/:doctorId" element={<DoctorDetail />} />
            <Route path="doctors/update/:doctorId" element={<UpdateDoctor />} />
            <Route path="doctors/all/schedules" element={<ScheduleList />} />
            <Route path="doctors/:doctorId/schedules/:scheduleId" element={<ScheduleDetail />} />
          </Route>

          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
