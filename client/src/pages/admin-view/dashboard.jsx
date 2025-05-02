import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderStatistics } from "@/store/admin/order-slice"; // Redux slice to call API
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
import { Card, Spinner, Alert } from "react-bootstrap";

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
  const { orderStatistics, isLoading, error } = useSelector(
    (state) => state.adminOrder
  );

  useEffect(() => {
    dispatch(getOrderStatistics("day"));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        Lỗi: {error}
      </Alert>
    );
  }

  if (!orderStatistics || orderStatistics.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        Không có dữ liệu thống kê.
      </Alert>
    );
  }

  const groupedData = {};
  let soldOrders = 0;
  let canceledOrders = 0;
  let stockOrders = 0;
  let processingOrders = 0;

  orderStatistics.forEach((item) => {
    const date = item._id.date || item._id.month;
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

    if (item._id.status === "delivered") {
      soldOrders += item.totalOrders;
    }

    if (item._id.status === "rejected") {
      canceledOrders += item.totalOrders;
    }

    if (["pending", "inProcess", "inShipping"].includes(item._id.status)) {
      stockOrders += item.totalOrders;
    }

    if (
      ["pending", "inProcess", "inShipping", "confirmed"].includes(
        item._id.status
      )
    ) {
      processingOrders += item.totalOrders;
    }
  });

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Đã xác nhận",
        data: Object.values(groupedData).map((item) => item.confirmed),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Đã hủy",
        data: Object.values(groupedData).map((item) => item.rejected),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
      {
        label: "Chờ xử lý",
        data: Object.values(groupedData).map((item) => item.pending),
        backgroundColor: "rgba(255, 159, 64, 0.8)",
      },
      {
        label: "Đang xử lý",
        data: Object.values(groupedData).map((item) => item.inProcess),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "Đang giao hàng",
        data: Object.values(groupedData).map((item) => item.inShipping),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
      },
      {
        label: "Đã giao",
        data: Object.values(groupedData).map((item) => item.delivered),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
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

  return (
    <div className="container mt-5">
      <div
        className="d-flex justify-content-between mb-4"
        style={{ display: "flex" }}
      >
        <div className="mb-3" style={{ flex: 1, padding: "0 10px" }}>
          <div
            className="text-center shadow-lg rounded card"
            style={{ backgroundColor: "rgb(227, 242, 253)" }}
          >
            <div className="card-body">
              <h5 className="card-title text-primary">Đơn hàng đã bán</h5>
              <p
                className="card-text"
                style={{ fontSize: "24px", fontWeight: "bold" }}
              >
                {soldOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-3" style={{ flex: 1, padding: "0 10px" }}>
          <div
            className="text-center shadow-lg rounded card"
            style={{ backgroundColor: "rgb(248, 215, 218)" }}
          >
            <div className="card-body">
              <h5 className="card-title text-danger">Đơn hàng đã hủy</h5>
              <p
                className="card-text"
                style={{ fontSize: "24px", fontWeight: "bold" }}
              >
                {canceledOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-3" style={{ flex: 1, padding: "0 10px" }}>
          <div
            className="text-center shadow-lg rounded card"
            style={{ backgroundColor: "rgb(255, 243, 205)" }}
          >
            <div className="card-body">
              <h5 className="card-title text-warning">Đơn hàng đang xử lý</h5>
              <p
                className="card-text"
                style={{ fontSize: "24px", fontWeight: "bold" }}
              >
                {processingOrders}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Card>
          <Card.Body>
            <h3
              className="text-center mb-4"
              style={{ fontWeight: "bold", color: "#1976D2" }}
            >
              Thống kê trạng thái đơn hàng
            </h3>
            <Bar data={chartData} options={chartOptions} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashBoard;
