import { useState, useEffect } from "react";

import { Loader, Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import DeleteUser from "./DeleteUser";
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

import { getAllUsers } from "@/service/authService";
import { Badge } from "@/components/ui/badge";
import DeleteUser from "./DeleteUser";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.DT); // Set users to the fetched data
      setLoading(false);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_profiles?.[0]?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_profiles?.[0]?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
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

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Tìm kiếm bằng email, tên, hoặc số điện thoại..."
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
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.user_id} className="border-b">
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {user.user_profiles?.[0]?.full_name || "N/A"}
                    </td>

                    <td className="px-4 py-2">
                      {user.user_profiles?.[0]?.gender === "M"
                        ? "Nam"
                        : user.user_profiles?.[0]?.gender === "F"
                        ? "Nữ"
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {user.user_profiles?.[0]?.phone || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={
                          user.user_role === "ADMIN"
                            ? "admin"
                            : user.user_role === "DOCTOR"
                            ? "doctor"
                            : user.user_role === "PATIENT"
                            ? "patient"
                            : "light"
                        }
                      >
                        {user.user_role || "N/A"}
                      </Badge>
                    </td>

                    <td className="px-4 py-2 flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.user_id}`)}
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash size={16} className="mr-2" />
                        Delete
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

                {/* Render các trang số */}
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

                {/* Render dấu chấm nếu số trang nhiều hơn 5 */}
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

      {/* Modal Xác Nhận Xóa */}
      {userToDelete && (
        <DeleteUser
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          userData={userToDelete}
          fetchAllListUser={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserList;

