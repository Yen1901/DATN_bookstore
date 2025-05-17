import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Bên trái: Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-12">
        <div className="max-w-md text-center text-white space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Nhà sách Tiến Thọ
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Nơi lưu giữ tri thức – Đồng hành cùng bạn trên mọi hành trình khám phá tri thức.
          </p>
        </div>
      </div>

      {/* Bên phải: Form Login/Register */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
