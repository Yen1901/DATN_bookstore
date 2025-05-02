import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 text-center shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl font-bold text-green-600">
            Thanh toán thành công!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
          </p>
          <Button className="w-full" onClick={() => navigate("/shop/account")}>
            Xem đơn hàng
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
