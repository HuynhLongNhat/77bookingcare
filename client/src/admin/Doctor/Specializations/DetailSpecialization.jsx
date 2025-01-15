import  { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Loader,
} from "lucide-react";
import { getSpecializationsById } from "@/service/doctorService";
import { useNavigate, useParams } from "react-router-dom";
const DetailSpecialization = () => {
  const {specializationId} = useParams()
  const navigate = useNavigate()
  const [specialization, setSpecialization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    

    fetchDataSpecializationById();
  }, []);
  
    const fetchDataSpecializationById = async () => {
      try {
        const res = await getSpecializationsById(specializationId);
        console.log("res", res);
        setSpecialization(res.data.DT);
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
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="w-9 h-9 p-0"
              onClick={() => navigate("/admin/doctor/specializations")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Chi tiết chuyên khoa</h2>
              <p className="text-muted-foreground">
                Thông tin chi tiết về chuyên khoa
              </p>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate(`/admin/doctor/specializations/update/${specializationId}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                {specialization.avatar ? (
                  <img
                    src={specialization.avatar}
                    alt={specialization.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Không có hình ảnh</span>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold">{specialization.name}</h3>
              <p className="text-gray-600">{specialization.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailSpecialization;
