import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  KeyRound,
  Stethoscope,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {toast} from "../hooks/use-toast"
import { registerUser } from "@/service/authService";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (formData.password !== formData.confirmPassword) {
     toast({
       variant: "destructive",
       title: "Lỗi",
       description: "Mật khẩu không khớp!",
     });
     return;
   }

   const res = await registerUser(formData);
   if (res?.data.EC === 0) {
     toast({
       variant: "success",
       title: `${res.data.EM}`,
       description: "Đăng ký tài khoản thành công!",
     });
     navigate("/login");
   } 
   else if (res?.data.EC === -1) {
     toast({
       variant: "destructive",
       title: `${res.data.EM}`,
       description: "Đã có lỗi xảy ra khi đăng ký",
     });
   }
 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative px-4 py-10 bg-white shadow-xl sm:rounded-3xl sm:p-16 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-95"
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-4"
              >
                <div className="p-4 bg-teal-500 rounded-full">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Đăng Ký Tài Khoản
              </h2>
              <p className="text-gray-600">
                Hệ thống đặt lịch khám bệnh trực tuyến
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  placeholder="Email của bạn"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                  )}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg"
                type="submit"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Đăng Ký Ngay
              </motion.button>
            </form>

            <div className="mt-8 text-center space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">Đã có tài khoản?</span>
                <Link
                  to="/login"
                  className="ml-1 font-medium text-teal-600 hover:text-teal-500"
                >
                  Đăng nhập
                </Link>
              </div>
              <div className="text-xs">
                <Link
                  to="/forgot-password"
                  className="text-gray-500 hover:text-teal-500"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupForm;
