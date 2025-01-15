import  { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, ArrowLeft, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { getSpecializationsById, updateSpecializations } from "@/service/doctorService";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const UpdateSpecialization = () => {
  const { specializationId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
   fetchSpecializationDetails();
  }, []);

    const fetchSpecializationDetails = async () => {
    try {
      const res = await getSpecializationsById(specializationId);
    
        setName( res.data.DT.name),
        setDescription( res.data.DT.description),
        setAvatar(res.data.DT.avatar),
        setInitialLoading(false);
    } catch (error) {
      console.error(error);
      setInitialLoading(false);
    }
  }

 const handleAvatarChange = async (e) => {
   const file = e.target.files[0];
   if (!file) return;

   // Hiển thị ảnh preview
   setAvatar(URL.createObjectURL(file));

   // Upload ảnh lên Cloudinary
   const formData = new FormData();
   formData.append("file", file);
   formData.append("upload_preset", "ssga5jml");
   formData.append("api_key", "963862276821583");
   try {
     const response = await axios.post(
       `https://api.cloudinary.com/v1_1/dbnofh9a8/image/upload`,
       formData
     );
     setAvatarUrl(response.data.secure_url);
   } catch (error) {
     console.error("Upload ảnh thất bại:", error);
   }
 };

   const handleSubmit = async (e) => {
     e.preventDefault();
    setLoading(true);
   

  let res = await updateSpecializations(specializationId, {
    name: name,
    description: description,
    avatar: avatarUrl,
  });
  console.log(" data", res);
  if (res && res.data.EC === 0) {
    toast({
      variant: "success",
      description: res.data.EM,
    });
    navigate("/admin/doctor/specializations");
  }
  if (res && res.data.EC === -1) {
    toast({
      variant: "destructive",
      description: res.data.EM,
    });
  }
  if (res && res.data.EC === -2) {
    toast({
      variant: "destructive",
      description: res.data.EM,
    });
  }
     }
   

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Button
            variant="ghost"
            className="w-9 h-9 p-0"
            onClick={() => navigate("/admin/doctor/specializations")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Chỉnh sửa chuyên khoa</h2>
            <p className="text-muted-foreground">
              Cập nhật thông tin chi tiết cho chuyên khoa
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hình ảnh đại diện</label>
              <div className="flex items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {avatar ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={avatar}
                        alt="Preview"
                        className="w-auto h-full max-h-full object-contain rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setAvatar(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click để tải ảnh</span>{" "}
                        hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (Tối đa 2MB)
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tên chuyên khoa</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên chuyên khoa"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả chi tiết về chuyên khoa"
                rows={6}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/admin/doctor/specializations")}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Lưu thay đổi"} 
              
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSpecialization;
