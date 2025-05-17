import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        if (data?.payload?.user?.isActive === false) {
          toast({
            title: "Tài khoản của bạn đã bị khóa.",
            description: "Vui lòng liên hệ với quản trị viên.",
            variant: "destructive",
          });
          return;
        }
        toast({ title: data?.payload?.message });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600">Đăng nhập</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Bạn chưa có tài khoản?
          <Link
            className="ml-2 font-semibold text-purple-600 hover:underline"
            to="/auth/register"
          >
            Đăng ký
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Đăng nhập"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
