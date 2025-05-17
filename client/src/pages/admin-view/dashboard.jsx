import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderStatistics,
} from "@/store/admin/order-slice";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Alert } from "react-bootstrap";
import LoadingScreen from "@/components/common/loading";
import { CheckCircle, DollarSign, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashBoard() {
  const dispatch = useDispatch();
  const { orderStatistics, isLoading, error, orderList } = useSelector(
    (state) => state.adminOrder
  );
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterPeriod, setFilterPeriod] = useState("7days");

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
    dispatch(getOrderStatistics("day"));
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(orderList)) return;
    let total = 0;
    const deliveredOrders = orderList.filter(
      (order) => order.orderStatus === "delivered"
    );
    deliveredOrders.forEach((order) => {
      order.cartItems.forEach((cartItem) => {
        total += cartItem.price * cartItem.quantity;
      });
    });
    setTotalRevenue(total);
  }, [orderList]);

  // Date Parsing and Filter Logic (unchanged)
  const parseDateString = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 2);
  threeMonthsAgo.setDate(1);
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  oneYearAgo.setDate(1);

  let filteredData = [];
  if (orderStatistics) {
    filteredData = orderStatistics.filter((item) => {
      const orderDate = parseDateString(item._id.date);
      if (filterPeriod === "7days") {
        return orderDate >= sevenDaysAgo && orderDate <= now;
      } else if (filterPeriod === "month") {
        return orderDate >= startOfMonth && orderDate <= now;
      } else if (filterPeriod === "3months") {
        return orderDate >= threeMonthsAgo && orderDate <= now;
      } else if (filterPeriod === "6months") {
        return orderDate >= sixMonthsAgo && orderDate <= now;
      } else if (filterPeriod === "1year") {
        return orderDate >= oneYearAgo && orderDate <= now;
      }
      return true;
    });
  }

  const groupedData = {};
  let soldOrders = 0;
  let canceledOrders = 0;

  filteredData.forEach((item) => {
    const date = item._id.date;
    if (!groupedData[date]) {
      groupedData[date] = {
        confirmed: 0,
        rejected: 0,
        pending: 0,
        inProcess: 0,
        inShipping: 0,
        delivered: 0,
      };
    }
    groupedData[date][item._id.status] = item.totalOrders || 0;
    if (item._id.status === "delivered") soldOrders += item.totalOrders;
    if (item._id.status === "rejected") canceledOrders += item.totalOrders;
  });

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Đã xác nhận",
        data: Object.values(groupedData).map((item) => item.confirmed),
        backgroundColor: "#4db6ac",
      },
      {
        label: "Đã hủy",
        data: Object.values(groupedData).map((item) => item.rejected),
        backgroundColor: "#e57373",
      },
      {
        label: "Chờ xử lý",
        data: Object.values(groupedData).map((item) => item.pending),
        backgroundColor: "#ffb74d",
      },
      {
        label: "Đang xử lý",
        data: Object.values(groupedData).map((item) => item.inProcess),
        backgroundColor: "#64b5f6",
      },
      {
        label: "Đang giao hàng",
        data: Object.values(groupedData).map((item) => item.inShipping),
        backgroundColor: "#9575cd",
      },
      {
        label: "Đã giao",
        data: Object.values(groupedData).map((item) => item.delivered),
        backgroundColor: "#81c784",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} đơn`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Ngày",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Số lượng đơn",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
    },
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <Alert variant="danger">Lỗi: {error}</Alert>;
  if (!orderStatistics || orderStatistics.length === 0) {
    return <Alert variant="warning">Không có dữ liệu thống kê.</Alert>;
  }

  return (
    <div className="container py-4">
      <div
        className="d-flex justify-content-between gap-3 mb-3"
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <div
          className="card text-center border-0 shadow-lg rounded-3"
          style={{
            flex: "1 1 30%",
            backgroundColor: "#E3F2FD",
            minWidth: "280px",
            transition: "transform 0.3s ease-in-out",
            padding: "20px",
          }}
        >
          <div className="card-body py-4 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <CheckCircle size={40} className="text-primary mb-2" />
              <div className="ms-3 text-start">
                <h5
                  className="card-title text-primary fw-bold mb-1"
                  style={{ fontSize: "1.25rem" }}
                >
                  Đơn hàng đã bán
                </h5>
                <h2
                  className="display-5 fw-bold text-dark"
                  style={{ fontSize: "2.5rem" }}
                >
                  {soldOrders}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div
          className="card text-center border-0 shadow-lg rounded-4"
          style={{
            flex: "1 1 30%",
            backgroundColor: "#F8D7DA",
            minWidth: "280px",
            transition: "transform 0.3s ease-in-out",
            padding: "20px",
          }}
        >
          <div className="card-body py-4 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <XCircle size={40} className="text-danger mb-2" />
              <div className="ms-3 text-start">
                <h5
                  className="card-title text-danger fw-bold mb-1"
                  style={{ fontSize: "1.25rem" }}
                >
                  Đơn hàng đã hủy
                </h5>
                <h2
                  className="display-5 fw-bold text-dark"
                  style={{ fontSize: "2.5rem" }}
                >
                  {canceledOrders}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div
          className="card text-center border-0 shadow-lg rounded-4"
          style={{
            flex: "1 1 30%",
            backgroundColor: "#FFF3CD",
            minWidth: "280px",
            transition: "transform 0.3s ease-in-out",
            padding: "20px",
          }}
        >
          <div className="card-body py-4 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <DollarSign size={40} className="text-warning mb-2" />
              <div className="ms-3 text-start">
                <h5
                  className="card-title text-warning fw-bold mb-1"
                  style={{ fontSize: "1.25rem" }}
                >
                  Tổng doanh thu
                </h5>
                <h2
                  className="display-5 fw-bold text-dark"
                  style={{ fontSize: "2.5rem" }}
                >
                  ${totalRevenue}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow rounded-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
            <h3
              className="mb-0"
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#2c3e50",
                letterSpacing: "0.5px",
              }}
            >
              📊 Thống kê đơn hàng
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-base font-medium border-2 border-blue-500 px-5 py-2 rounded-xl shadow-sm hover:bg-blue-50"
                >
                  {
                    {
                      "7days": "7 ngày",
                      month: "1 tháng",
                      "3months": "3 tháng",
                      "6months": "6 tháng",
                      "1year": "1 năm",
                    }[filterPeriod]
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => setFilterPeriod("7days")}>
                  7 ngày
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPeriod("month")}>
                  1 tháng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPeriod("3months")}>
                  3 tháng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPeriod("6months")}>
                  6 tháng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPeriod("1year")}>
                  1 năm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="p-4 bg-body-tertiary rounded-4 border">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminDashBoard;
