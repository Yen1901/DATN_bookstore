// src/components/common/LoadingScreen.jsx
import { Loader2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl px-8 py-10 flex flex-col items-center space-y-4">
        <div className="bg-indigo-100 p-4 rounded-full">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        </div>

        <h1 className="text-2xl font-bold text-indigo-700">
          Nhà sách Tiến Thọ
        </h1>

        <p className="text-gray-600 text-sm text-center max-w-xs">
          Hệ thống đang khởi động. Vui lòng chờ trong giây lát...
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
