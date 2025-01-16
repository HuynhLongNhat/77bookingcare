import { useState, useEffect } from "react";
import { Loader, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { getAllDoctors } from "@/service/doctorService";
const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Giả định có API getAllDoctors
      const response = await getAllDoctors();
      console.log("response: " + response)
      setDoctors(response.data.DT);
      setLoading(false);
    } catch (err) {
      setError("Error fetching doctors");
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

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

  const getPositionBadgeVariant = (position) => {
    switch (position) {
      case "MASTER":
        return "default";
      case "PROFESSOR":
        return "secondary";
      case "DOCTOR":
        return "outline";
      default:
        return "light";
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Danh sách bác sĩ</h2>
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Tìm kiếm theo email, tên, hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Họ và tên</th>
                  <th className="px-4 py-2">Chức danh</th>
                  <th className="px-4 py-2">Kinh nghiệm</th>
                  <th className="px-4 py-2">Chuyên khoa</th>
                  <th className="px-4 py-2 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.map((doctor) => (
                  <tr key={doctor.doctor_id} className="border-b">
                    <td className="px-4 py-2">{doctor.email}</td>
                    <td className="px-4 py-2">{doctor.full_name}</td>
                    <td className="px-4 py-2">
                      <Badge variant={getPositionBadgeVariant(doctor.position)}>
                        {doctor.position}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">{doctor.experience_years} năm</td>
                    <td className="px-4 py-2">{doctor.specialization?.name}</td>
                    <td className="px-4 py-2 flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/doctors/${doctor.doctor_id}`)
                        }
                      >
                        <Eye size={16} className="mr-2" />
                        Xem
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDoctor(doctor)}
                      >
                        <Trash size={16} className="mr-2" />
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage(index + 1)}
                      active={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* {doctorToDelete && (
        <DeleteDoctor
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          doctorData={doctorToDelete}
          fetchAllListDoctor={fetchDoctors}
        />
      )} */}
    </div>
  );
};

export default DoctorList;
