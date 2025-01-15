import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Award,
  Stethoscope,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash,
} from "lucide-react";
import { motion } from "framer-motion";
import { getAllSchedule } from "@/service/doctorService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ScheduleList = () => {
  const  navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchAllSchedule();
  }, []);

  const fetchAllSchedule = async () => {
    const res = await getAllSchedule();
    if (res && res.data.EC === 0) {
      setSchedules(res.data.DT);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Sửa lại hàm filter để check null/undefined
  const filteredSchedules = schedules.filter((schedule) => {
    const doctorName =
      schedule?.doctor?.user?.userData?.user_profiles?.[0]?.full_name || "";
    const specialization = schedule?.doctor?.specialization || "";

    return (
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchedules.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Lịch Làm Việc Bác Sĩ
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi lịch làm việc của đội ngũ y tế
            </p>
          </div>

          <div className="relative mb-8">
            <div className="max-w-xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bác sĩ hoặc chuyên khoa..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-600 text-lg transition-all duration-300"
              />
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {currentItems.map((schedule, index) => (
              <motion.div
                key={schedule.schedule_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">
                          {
                            schedule.doctor.user.userData.user_profiles[0]
                              .full_name
                          }
                        </h2>
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {schedule.doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600 text-sm">
                        {formatDate(schedule.schedule_date)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600 text-sm">
                        {formatTime(schedule.start_time)} -{" "}
                        {formatTime(schedule.end_time)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="bg-yellow-100 px-3 py-1 rounded-full">
                        <span className="text-yellow-700 text-sm font-medium">
                          {schedule.doctor.position}
                        </span>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          schedule.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {schedule.status === "available" ? "Có sẵn" : "Đã đặt"}
                      </span>
                    </div>
                  </div>

                  {/* New Buttons */}
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-blue-500 hover:text-blue-600 flex-grow mr-2"
                      onClick={() =>
                        navigate(
                          `/admin/doctors/${schedule.doctor.doctor_id}/schedules/${schedule.schedule_id}`
                        )
                      }
                    >
                      <Eye size={16} className="mr-2" />
                      Chi tiết
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="flex-grow"
                    >
                      <Trash size={16} className="mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white shadow-lg"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
