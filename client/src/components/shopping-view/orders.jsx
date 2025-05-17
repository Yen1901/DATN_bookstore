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
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const ordersPerPage = 10;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getI) {
    dispatch(getOrderDetails(getI));
  }

  function handleSort(key) {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orderList.length / ordersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [orderList]);

  function getPaginationRange(currentPage, totalPages) {
    const pages = [];
    const range = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i);
      }
    }

    return pages.reduce((acc, page, i, arr) => {
      if (i > 0 && page - arr[i - 1] > 1) {
        acc.push("...");
      }
      acc.push(page);
      return acc;
    }, []);
  }

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
              {currentOrders && currentOrders.length > 0
                ? currentOrders.map((orderItem) => (
                    <TableRow key={orderItem._id} className="hover:bg-gray-50">
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
                          <ShoppingOrderDetailsView
                            orderDetails={orderDetails}
                          />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <Button
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`w-10 h-10 rounded-full shadow-sm border transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            ←
          </Button>

          {getPaginationRange(currentPage, totalPages).map((page, index) => (
            <Button
              key={index}
              size="icon"
              onClick={() => page !== "..." && setCurrentPage(page)}
              className={`w-10 h-10 rounded-full shadow-sm border transition-colors ${
                currentPage === page
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </Button>
          ))}

          <Button
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`w-10 h-10 rounded-full shadow-sm border transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
