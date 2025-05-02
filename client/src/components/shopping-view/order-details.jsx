import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã đơn hàng:</span>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày đặt:</span>
              <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng:</span>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Phương thức thanh toán:
              </span>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Tình trạng thanh toán:
              </span>
              <Label>
                {orderDetails?.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </Label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Trạng thái đơn hàng:
              </span>
              <Badge
                className={`py-1 px-3 text-white capitalize ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "pending"
                    ? "bg-yellow-500"
                    : orderDetails?.orderStatus === "inProcess"
                    ? "bg-blue-500"
                    : orderDetails?.orderStatus === "inShipping"
                    ? "bg-indigo-500"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : "bg-gray-600"
                }`}
              >
                {orderDetails?.orderStatus === "confirmed"
                  ? "Đã xác nhận"
                  : orderDetails?.orderStatus === "rejected"
                  ? "Đã hủy"
                  : orderDetails?.orderStatus === "pending"
                  ? "Chờ xử lý"
                  : orderDetails?.orderStatus === "inProcess"
                  ? "Đang xử lý"
                  : orderDetails?.orderStatus === "inShipping"
                  ? "Đang giao hàng"
                  : orderDetails?.orderStatus === "delivered"
                  ? "Đã giao"
                  : "Chưa xác định"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3">
          <h2 className="text-lg font-semibold">Chi tiết sản phẩm</h2>
          <ul className="grid gap-3 max-h-72 overflow-y-auto pr-2">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails.cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-4 p-3 border rounded-md bg-muted"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 grid gap-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Giá: ${item.price}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground italic">
                Không có sản phẩm trong đơn hàng.
              </li>
            )}
          </ul>
        </div>

        <Separator />

        <div className="grid gap-3">
          <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
          <div className="grid gap-1 text-sm text-muted-foreground bg-muted p-4 rounded-md">
            <span>
              <strong>Tên người nhận:</strong> {user?.userName}
            </span>
            <span>
              <strong>Số điện thoại:</strong> {orderDetails?.addressInfo?.phone}
            </span>
            <span>
              <strong>TP/Tỉnh:</strong> {orderDetails?.addressInfo?.city}
            </span>
            <span>
              <strong>Quận/Huyện:</strong> {orderDetails?.addressInfo?.district}
            </span>
            <span>
              <strong>Phường/Xã:</strong> {orderDetails?.addressInfo?.ward}
            </span>
            <span>
              <strong>Địa chỉ cụ thể:</strong>{" "}
              {orderDetails?.addressInfo?.address}
            </span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
