import { useState } from "react";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch } from "react-redux";
import { updateUserStatus } from "@/store/admin/user-slice";

function AdminUserDetailsView({ userDetails }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    status: userDetails.isActive.toString(),
    role: userDetails.role,
  });

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

  const handleUpdateStatus = async () => {
    const isActive = formData.status === "true";
    const role = formData.role;

    try {
      await dispatch(
        updateUserStatus({
          id: userDetails._id,
          isActive,
          role,
        })
      ).unwrap();
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[650px] p-6 rounded-2xl shadow-lg bg-white">
      <div className="max-h-[80vh] overflow-y-auto pr-1">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Thông tin tài khoản</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border">
          <div>
            <span className="block text-muted-foreground mb-1">Mã người dùng</span>
            <Label className="font-medium">{userDetails._id}</Label>
          </div>
          <div>
            <span className="block text-muted-foreground mb-1">Tên người dùng</span>
            <Label className="font-medium">{userDetails.userName}</Label>
          </div>
          <div>
            <span className="block text-muted-foreground mb-1">Email</span>
            <Label className="font-medium">{userDetails.email}</Label>
          </div>
          <div>
            <span className="block text-muted-foreground mb-1">Phân quyền</span>
            <Label className="font-medium">{getRoleLabel(userDetails.role)}</Label>
          </div>
          <div className="sm:col-span-2">
            <span className="block text-muted-foreground mb-1">Trạng thái</span>
            <Badge
              variant="outline"
              className={`px-3 py-1 rounded-full text-sm font-medium border-none ${
                userDetails.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {userDetails.isActive ? "Hoạt động" : "Đã khóa"}
            </Badge>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="bg-gray-50 p-4 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Chỉnh sửa thông tin</h3>

          <CommonForm
            formControls={[
              {
                label: "Trạng thái tài khoản",
                name: "status",
                componentType: "select",
                options: [
                  { id: "true", label: "Hoạt động" },
                  { id: "false", label: "Đã khóa" },
                ],
              },
              {
                label: "Phân quyền tài khoản",
                name: "role",
                componentType: "select",
                options: [
                  { id: "user", label: "Khách hàng" },
                  { id: "admin", label: "Quản trị viên" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Cập nhật thông tin tài khoản"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminUserDetailsView;
