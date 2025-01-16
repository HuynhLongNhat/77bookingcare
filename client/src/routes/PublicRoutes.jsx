// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("authToken"));

  // Nếu đã đăng nhập, chuyển hướng đến dashboard
  if (auth?.token) {
    return <Navigate to="/" />; // hoặc bất kỳ trang nào khác như "/dashboard"
  }

  // Nếu chưa đăng nhập, render nội dung của route
  return children;
};

export default PublicRoute;
