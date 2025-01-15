import { ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("authToken")); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Main header */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                77BookingCare
              </h1>
            </div>

            {/* Desktop menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-blue-600 font-medium">
                Trang chủ
              </Link>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600">
                  Chuyên khoa
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
              <Link to="/doctors" className="text-gray-700 hover:text-blue-600">
                Bác sĩ
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600"
              >
                Dịch vụ
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">
                Liên hệ
              </Link>

              {/* Conditional Menu */}
              {auth ? (
                // Đã đăng nhập
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <User size={20} className="mr-2" />
                    {auth.email}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded shadow-md">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Thông tin cá nhân
                      </Link>

                      {auth.role.includes("ADMIN") && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                         Admin dashboard
                        </Link>
                      )}
                      {auth.role.includes("DOCTOR") && (
                        <Link
                          to="/doctor/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Doctor dashboard
                        </Link>
                      )}
                      <Link
                        to="/change-password"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Đổi mật khẩu
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Chưa đăng nhập
                <>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
