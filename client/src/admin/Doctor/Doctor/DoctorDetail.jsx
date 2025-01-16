import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Award,
  Briefcase,
  Loader,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorsById } from "@/service/doctorService";

const DoctorDetail = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorById();
  }, []);

  const fetchDoctorById = async () => {
    try {
      const res = await getDoctorsById(doctorId);
      console.log("res", res);
      setDoctor(res.data.DT);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center gap-4 mb-6">
              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                onClick={() => navigate("/admin/doctors")}
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">
                  Thông tin bác sĩ
                </h1>
                <p className="text-blue-100">Chi tiết thông tin bác sĩ</p>
              </div>
              {/* Edit Button */}
              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                onClick={() => navigate(`/admin/doctors/update/${doctorId}`)}
              >
                <Edit className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Avatar & Basic Info */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    {doctor?.avatar ? (
                      <img
                        src={doctor?.avatar}
                        alt={doctor?.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100">
                        <User size={64} className="text-blue-500" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {doctor?.full_name}
                  </h2>
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold">{doctor?.position}</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {doctor?.specialization?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Detailed Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin liên hệ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{doctor?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="text-gray-900">{doctor?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="text-gray-900">{doctor?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày sinh</p>
                        <p className="text-gray-900">
                          {new Date(doctor?.date_of_birth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin chuyên môn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Kinh nghiệm</p>
                        <p className="text-gray-900">
                          {doctor?.experience_years} năm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phí tư vấn</p>
                        <p className="text-gray-900">
                          {Number(doctor?.consultation_fee).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VNĐ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specialization */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Chuyên khoa</h3>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      {doctor?.specialization.name}
                    </h4>
                    <p className="text-gray-600">
                      {doctor?.specialization.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
