import { Shield, AlertCircle, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UnAuthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mx-auto w-32 h-32 mb-8"
        >
          <Shield className="w-full h-full text-red-500" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <AlertCircle className="w-12 h-12 text-red-600" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-red-600 mb-4"
        >
          Truy cập bị từ chối
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2 mb-8"
        >
          <p className="text-lg text-gray-600">
            Xin lỗi, bạn không có quyền truy cập vào trang này.
          </p>
          <p className="text-sm text-gray-500">
            Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một sự nhầm
            lẫn.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnAuthorized;
