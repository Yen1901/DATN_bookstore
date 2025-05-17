import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  getAllUsers,
  getUserByID,
  resetUserDetails,
} from "@/store/admin/user-slice";
import AdminUserDetailsView from "./user-detail";

function AdminUsersView() {
  const dispatch = useDispatch();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { users, userDetails } = useSelector((state) => state.adminUser);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleFetchUserDetails = (userId) => {
    setSelectedUserId(userId);
    setOpenDetailsDialog(true);
    dispatch(getUserByID(userId));
  };

  const handleCloseDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedUserId(null);
    dispatch(resetUserDetails());
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "user":
        return "Khách hàng";
      default:
        return role;
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) => (
      <Button
        key={index}
        size="icon"
        variant={page === currentPage ? "default" : "outline"}
        className={`w-10 h-10 rounded-full text-sm font-medium ${
          page === "..." ? "cursor-default text-gray-400" : ""
        }`}
        disabled={page === "..."}
        onClick={() => typeof page === "number" && goToPage(page)}
      >
        {page}
      </Button>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center">Mã</TableHead>
                <TableHead className="text-center">Tên người dùng</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Vai trò</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50">
                  <TableCell className="text-center">{user._id}</TableCell>
                  <TableCell className="text-center">{user.userName}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    {getRoleLabel(user.role)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`border-none ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Hoạt động" : "Đã khóa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:opacity-90"
                      onClick={() => handleFetchUserDetails(user._id)}
                    >
                      Sửa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            size="icon"
            variant="outline"
            className="w-10 h-10 rounded-full"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </Button>
          {renderPageNumbers()}
          <Button
            size="icon"
            variant="outline"
            className="w-10 h-10 rounded-full"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </Button>
        </div>
      </CardContent>

      <Dialog open={openDetailsDialog} onOpenChange={handleCloseDialog}>
        {userDetails && <AdminUserDetailsView userDetails={userDetails} />}
      </Dialog>
    </Card>
  );
}

export default AdminUsersView;
