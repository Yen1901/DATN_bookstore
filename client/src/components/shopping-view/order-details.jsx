import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const hiddenRef = useRef();

  const handleExportInvoice = async () => {
    const invoiceContent = hiddenRef.current;

    if (!invoiceContent) {
      console.error("Không tìm thấy nội dung hóa đơn để xuất PDF.");
      return;
    }

    invoiceContent.style.visibility = "visible";
    invoiceContent.style.position = "static";

    await new Promise((resolve) => setTimeout(resolve, 300));

    const options = {
      filename: `hoadon-${orderDetails?._id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().from(invoiceContent).set(options).save();

    invoiceContent.style.visibility = "hidden";
    invoiceContent.style.position = "absolute";
  };

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

        <Button
          onClick={handleExportInvoice}
          disabled={
            orderDetails?.paymentStatus !== "paid" ||
            orderDetails?.orderStatus === "rejected" ||
            orderDetails?.orderStatus === "pending" ||
            orderDetails?.orderStatus === "inProcess"
          }
          style={{
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "200px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "18px" }}>🧾</span> Xuất hóa đơn
        </Button>

        <div
          ref={hiddenRef}
          style={{
            position: "absolute",
            left: "-9999px",
            visibility: "hidden",
            width: "800px",
            padding: "32px",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            color: "#000",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1 style={{ margin: 0, fontSize: "28px" }}>Nhà sách Tiến Thọ</h1>
            <h2
              style={{
                margin: "8px 0",
                fontSize: "20px",
                borderBottom: "2px solid #333",
                paddingBottom: "6px",
              }}
            >
              HÓA ĐƠN THANH TOÁN
            </h2>
            <p style={{ fontStyle: "italic", color: "#666" }}>
              Cảm ơn bạn đã mua hàng!
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <p>
              <strong>Mã đơn hàng:</strong> {orderDetails?._id}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(orderDetails?.orderDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>Tổng tiền:</strong> $
              {orderDetails?.totalAmount.toLocaleString()}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {orderDetails?.paymentMethod}
            </p>
            <p>
              <strong>Tình trạng thanh toán:</strong>{" "}
              {orderDetails?.paymentStatus === "paid"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </p>
            <p>
              <strong>Trạng thái đơn hàng:</strong>{" "}
              {{
                confirmed: "Đã xác nhận",
                rejected: "Đã hủy",
                pending: "Chờ xử lý",
                inProcess: "Đang xử lý",
                inShipping: "Đang giao hàng",
                delivered: "Đã giao",
              }[orderDetails?.orderStatus] || "Không rõ"}
            </p>
          </div>

          <h3
            style={{
              marginBottom: "10px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "4px",
            }}
          >
            Chi tiết sản phẩm
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                  Tên sách
                </th>
                <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                  Số lượng
                </th>
                <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                  Giá
                </th>
                <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.cartItems?.map((item) => (
                <tr key={item._id}>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {item.title}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    ${item.price.toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "right",
                    padding: "10px",
                    borderTop: "2px solid #ccc",
                  }}
                >
                  <strong>Tổng phụ:</strong>
                </td>
                <td style={{ padding: "10px", borderTop: "2px solid #ccc" }}>
                  <strong>
                    $
                    {orderDetails?.cartItems
                      ?.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toLocaleString()}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>

          <h3
            style={{
              marginBottom: "10px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "4px",
            }}
          >
            Thông tin giao hàng
          </h3>
          <p>
            <strong>Tên người nhận:</strong> {user?.userName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {orderDetails?.addressInfo?.phone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {orderDetails?.addressInfo?.address},{" "}
            {orderDetails?.addressInfo?.ward},{" "}
            {orderDetails?.addressInfo?.district},{" "}
            {orderDetails?.addressInfo?.city}
          </p>

          <div
            style={{ marginTop: "40px", textAlign: "center", color: "#888" }}
          >
            <p>--- HẾT HÓA ĐƠN ---</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
