import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { toast } from "../../../hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { getAllSpecializations, getDoctorsById, updateDoctorInfoByAdmin } from "@/service/doctorService";

const UpdateDoctor = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({
    full_name: "",
    avatar: "",
    email: "",
  });
  const [specialization_id , setSpecialties_id] = useState("");
  const [position , setPosition] = useState("");
  const [experience_years , setExperience_years] = useState(0);
  const [consultation_fee , setConsultation_fee] = useState(0);
   
  ;

  useEffect(() => {
    fetchDoctorData();
    fetchSpecialties();
  }, []);

const fetchDoctorData = async () => {
  try {
    // Replace with your actual API call
    const response = await getDoctorsById(doctorId);

    if (response.data.EC === 0) {
      const data = response.data.DT;
      setDoctorInfo({
        full_name: data.full_name,
        avatar: data.avatar,
        email: data.email,
      });

      // Cập nhật các giá trị riêng biệt trong trạng thái
      setSpecialties_id(data.specialization_id);
      setPosition(data.position);
      setExperience_years(data.experience_years);
      setConsultation_fee(data.consultation_fee);
    }
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    toast({
      variant: "destructive",
      title: "Failed to fetch doctor information",
    });
  }
};


  const fetchSpecialties = async () => {
    try {
      // Replace with your actual API call
      const response = await getAllSpecializations();
      if (response.data.EC === 0) {
        setSpecialties(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching specialties:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch specialties",
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateDoctorInfoByAdmin(doctorId, {
        specialization_id: specialization_id,
        position: position,
        experience_years: experience_years,
        consultation_fee: consultation_fee,
      });
       console.log("response" , response)
      if (response.data.EC === 0) {
        toast({
          variant: "success",
          title: "Updated successfully",
        });
        navigate("/admin/doctors");
      } else {
        toast({
          variant: "destructive",
          title: response.data.EM || "Update failed",
        });
      }
    } catch (error) {
      console.error("Error updating doctor info:", error);
      toast({
        variant: "destructive",
        title: "An error occurred while updating",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-56 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {doctorInfo.avatar ? (
                <img
                  src={doctorInfo.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                  <UserCircle size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {doctorInfo.full_name}
              </h1>
              <p className="mt-2 text-lg text-gray-600">{doctorInfo.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chuyên khoa
              </label>
              <select
                name="specialization_id"
                value={specialization_id}
                onChange={(e) => setSpecialties_id(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn chuyên khoa</option>
                {specialties.map((specialty) => (
                  <option
                    key={specialty.specialization_id}
                    value={specialty.specialization_id}
                  >
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vị trí
              </label>
              <select
                name="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn vị trí</option>
                <option value="NONE">NONE</option>
                <option value="MASTER">MASTER</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="ASSOCIATE PROFESSOR">ASSOCIATE PROFESSOR</option>
                <option value="PROFESSOR">PROFESSOR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số năm kinh nghiệm
              </label>
              <input
                type="number"
                name="experience_years"
                value={experience_years}
                onChange={(e) => setExperience_years(e.target.value)}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phí khám bệnh
              </label>
              <input
                type="number"
                name="consultation_fee"
                value={consultation_fee}
                onChange={(e) => setConsultation_fee(e.target.value)}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-medium rounded-lg px-6 py-3 hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Cập nhật
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/doctors")}
                className="flex-1 bg-gray-200 text-gray-800 text-lg font-medium rounded-lg px-6 py-3 hover:bg-gray-300 transition-all duration-300 shadow-lg"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctor;
