import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Shield,
} from "lucide-react";
import { getDetailsShedule } from "@/service/doctorService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ScheduleDetail = () => {
  const {doctorId , scheduleId} = useParams();
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    fetchScheduleDetail();
    console.log("scheduleDetail", schedule)
  }, []);
  const fetchScheduleDetail = async () => {
    const res = await getDetailsShedule(doctorId, scheduleId);
    console.log("data" , res.data.DT)
    if(res && res.data.EC === 0 ) {
        setSchedule(res.data.DT);
    }
   
  };
return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            Chi tiết lịch làm việc
          </h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Schedule Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin lịch hẹn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Ngày:{" "}
                  {schedule?.schedule_date
                    ? new Date(schedule.schedule_date).toLocaleDateString(
                        "vi-VN"
                      )
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Thời gian:{" "}
                  {schedule?.start_time && schedule?.end_time
                    ? `${schedule.start_time.slice(
                        0,
                        5
                      )} - ${schedule.end_time.slice(0, 5)}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Trạng thái:
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      schedule?.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {schedule?.status === "available" ? "Còn trống" : "Đã đặt"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Doctor Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin bác sĩ
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Họ tên:{" "}
                  {schedule?.doctor?.user?.userData?.user_profiles?.[0]
                    ?.full_name || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Chuyên khoa: {schedule?.doctor?.specialization?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Chức vụ: {schedule?.doctor?.position || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Số điện thoại:{" "}
                  {schedule?.doctor?.user?.userData?.user_profiles?.[0]
                    ?.phone || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Email: {schedule?.doctor?.user?.userData?.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">
                  Địa chỉ:{" "}
                  {schedule?.doctor?.user?.userData?.user_profiles?.[0]
                    ?.address || "N/A"}
                </span>
              </div>
              {schedule?.doctor?.user?.userData?.user_profiles?.[0]?.avatar && (
                <div className="flex items-center space-x-3">
                  <img
                    src={schedule.doctor.user.userData.user_profiles[0].avatar}
                    alt="Doctor Avatar"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default ScheduleDetail;
