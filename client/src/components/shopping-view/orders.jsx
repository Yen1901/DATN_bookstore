import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getI) {
    dispatch(getOrderDetails(getI));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log(orderDetails, "orderDetails");

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          🛒 Lịch sử đơn hàng
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full text-center">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-gray-700 font-medium text-center">
                  Mã đơn
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Ngày đặt
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Trạng thái
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Tổng tiền
                </TableHead>
                <TableHead className="text-center">
                  <span className="sr-only">Chi tiết</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-center">
                        {orderItem?._id}
                      </TableCell>
                      <TableCell className="text-center">
                        {orderItem?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-block px-3 py-1 text-sm rounded-full">
                          <Badge
                          className={`py-1 px-3 ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : orderItem?.orderStatus === "pending"
                              ? "bg-yellow-500"
                              : orderItem?.orderStatus === "inProcess"
                              ? "bg-blue-500"
                              : orderItem?.orderStatus === "inShipping"
                              ? "bg-indigo-500"
                              : orderItem?.orderStatus === "delivered"
                              ? "bg-green-500"
                              : "bg-gray-600"
                          }`}
                        >
                          {orderItem?.orderStatus === "confirmed"
                            ? "Đã xác nhận"
                            : orderItem?.orderStatus === "rejected"
                            ? "Đã hủy"
                            : orderItem?.orderStatus === "pending"
                            ? "Chờ xử lý"
                            : orderItem?.orderStatus === "inProcess"
                            ? "Đang xử lý"
                            : orderItem?.orderStatus === "inShipping"
                            ? "Đang giao hàng"
                            : orderItem?.orderStatus === "delivered"
                            ? "Đã giao"
                            : "Chưa xác định"}
                        </Badge>
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 text-center">
                        ${orderItem?.totalAmount}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                            size="sm"
                            className="bg-primary text-white hover:opacity-90"
                          >
                            Xem chi tiết
                          </Button>
                          <ShoppingOrderDetailsView orderDetails={orderDetails}/>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
