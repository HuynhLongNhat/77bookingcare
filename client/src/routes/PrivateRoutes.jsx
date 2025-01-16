// components/PrivateRoute.jsx
import UnAuthorized from "@/pages/UnAuthorizedPage";
import { Navigate } from "react-router-dom";


// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children, allowedRoles }) => {
  const auth = JSON.parse(localStorage.getItem("authToken"));

  // Chưa đăng nhập -> redirect to login
  if (!auth?.token) {
    return <Navigate to="/login" />;
  }
  const userRole = auth.role;
  // Không có quyền -> hiển thị trang Unauthorized
  // eslint-disable-next-line react/prop-types
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <UnAuthorized />;
  }

  return children;
};

export default PrivateRoute;
