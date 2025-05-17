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
import { useDispatch, useSelector } from "react-redux";
import AdminOrderDetailsView from "./order-details";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  function handleSort(key) {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const sortedOrders = [...orderList].sort((a, b) => {
    if (sortConfig.key === "orderDate") {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === "totalAmount") {
      return sortConfig.direction === "asc"
        ? a.totalAmount - b.totalAmount
        : b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / ordersPerPage)
  );

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [orderList]);

  console.log(orderList);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-700 font-medium text-center">
                Mã đơn
              </TableHead>
              <TableHead
                className="text-gray-700 font-medium text-center cursor-pointer select-none"
                onClick={() => handleSort("orderDate")}
              >
                Ngày đặt{" "}
                <span className="ml-1">
                  <span
                    className={
                      sortConfig.key === "orderDate" &&
                      sortConfig.direction === "asc"
                        ? "text-black font-bold"
                        : "text-gray-400"
                    }
                  >
                    ↑
                  </span>
                  <span
                    className={
                      sortConfig.key === "orderDate" &&
                      sortConfig.direction === "desc"
                        ? "text-black font-bold"
                        : "text-gray-400"
                    }
                  >
                    ↓
                  </span>
                </span>
              </TableHead>
              <TableHead className="text-gray-700 font-medium text-center">
                Trạng thái
              </TableHead>
              <TableHead
                className="text-gray-700 font-medium text-center cursor-pointer select-none"
                onClick={() => handleSort("totalAmount")}
              >
                Tổng tiền{" "}
                <span className="ml-1">
                  <span
                    className={
                      sortConfig.key === "totalAmount" &&
                      sortConfig.direction === "asc"
                        ? "text-black font-bold"
                        : "text-gray-400"
                    }
                  >
                    ↑
                  </span>
                  <span
                    className={
                      sortConfig.key === "totalAmount" &&
                      sortConfig.direction === "desc"
                        ? "text-black font-bold"
                        : "text-gray-400"
                    }
                  >
                    ↓
                  </span>
                </span>
              </TableHead>
              <TableHead className="text-center">
                <span className="sr-only">Chi tiết</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderList && orderList.length > 0
              ? paginatedOrders.map((orderItem) => (
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">
                      {orderItem?._id}
                    </TableCell>
                    <TableCell className="text-center">
                      {
                        new Date(orderItem?.orderDate)
                          .toISOString()
                          .replace("T", " ")
                          .split(".")[0]
                      }
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
                              ? "bg-green-700"
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
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center mt-6 gap-1 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ←
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .reduce((acc, page, i, arr) => {
              if (i > 0 && page - arr[i - 1] > 1) {
                acc.push("...");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((item, i) =>
              item === "..." ? (
                <span key={i} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  key={i}
                  size="icon"
                  className={`w-10 h-10 rounded-full border-2 ${
                    currentPage === item
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                  variant={currentPage === item ? "default" : "outline"}
                  onClick={() => setCurrentPage(item)}
                >
                  {item}
                </Button>
              )
            )}

          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default AdminOrdersView;
