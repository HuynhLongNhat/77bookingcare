import { useState, useEffect } from "react";
import { Loader, Trash, Eye,  Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAllSpecializations } from "@/service/doctorService";
import { useNavigate } from "react-router-dom";
import DeleteSpecialization from "./DeleteSpecialization";
const SpecializationList = () => {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [specializationToDelete, setSpecializationToDelete] = useState(null);

  useEffect(() => {
    fetchSpecializations();
  }, []);
  const fetchSpecializations = async() =>{
     try {
       let res = await getAllSpecializations() ;
       if( res && res.data.EC === 0) {
         setSpecializations(res.data.DT) ;
         setLoading(false) ;
       }
     } catch (error) {
      console.log(error);
     }
  }
  const filteredSpecializations = specializations.filter(
    (spec) =>
      spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSpecializations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredSpecializations.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
 
    const handleDeleteSpecialization = (spec) => {
      setSpecializationToDelete(spec);
      setShowDeleteModal(true);
    };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Danh sách chuyên khoa</h2>
            <p className="text-muted-foreground">
              Quản lý thông tin các chuyên khoa y tế
            </p>
          </div>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate("/admin/doctor/specializations/create")}
          >
            <Plus className="mr-2" size={16} />
            Thêm chuyên khoa
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((spec) => (
              <Card
                key={spec.specialization_id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="mb-4">
                    {spec.avatar ? (
                      <img
                        src={spec.avatar}
                        alt={spec.name}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{spec.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {spec.description}
                  </p>
                  <div className="flex justify-between space-x-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        navigate(
                          `/admin/doctor/specializations/${spec.specialization_id}`
                        );
                      }}
                    >
                      <Eye size={16} className="mr-2" />
                      Chi tiết
                    </Button>
                    <Button variant="destructive" size="lg" onClick={() => handleDeleteSpecialization(spec)
                    }>
                      <Trash size={16} className="mr-2" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      {specializationToDelete && (
        <DeleteSpecialization
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          specializationData={specializationToDelete}
          fetchSpecializations={fetchSpecializations}
        />
      )}
    </div>
  );
};

export default SpecializationList;
