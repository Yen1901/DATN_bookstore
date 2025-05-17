import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  useName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600">Tạo tài khoản</h1>
        <p className="mt-2 text-sm text-gray-600">
          Bạn đã có tài khoản?{" "}
          <Link
            className="font-semibold text-purple-600 hover:underline"
            to="/auth/login"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Đăng ký"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
