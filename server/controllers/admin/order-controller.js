const Order = require("../../models/Order");
const moment = require("moment");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Không có đơn hàng nào!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // const order = await Order.findById(id);
    const order = await Order.findById(id).populate('userId', 'userName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không có đơn hàng nào!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không có đơn hàng nào!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

const getOrderStatistics = async (req, res) => {
  try {
    const { period, monthYear } = req.params;
    console.log("Period:", period, "Month/Year:", monthYear);
    console.log("Đang thực hiện truy vấn thống kê với period:", period);

    let aggregationQuery;

    if (period === "month") {
      const startOfMonth = moment(monthYear, "MM/YYYY").startOf("month").toDate();
      const endOfMonth = moment(monthYear, "MM/YYYY").endOf("month").toDate();

      console.log("Start of month:", moment(startOfMonth).format("DD-MM-YYYY"));
      console.log("End of month:", moment(endOfMonth).format("DD-MM-YYYY"));

      aggregationQuery = [
        {
          $match: {
            orderDate: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $project: {
            formattedMonth: {
              $dateToString: { format: "%Y-%m", date: "$orderDate" }
            },
            orderStatus: 1,
            totalAmount: 1,
            orderDate: 1
          }
        },
        {
          $group: {
            _id: {
              month: "$formattedMonth",
              status: "$orderStatus"
            },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" }
          }
        },
        { $sort: { "_id.month": 1, "_id.status": 1 } }
      ];
    } else {
      aggregationQuery = [
        {
          $project: {
            formattedDate: {
              $dateToString: { format: "%d/%m/%Y", date: "$orderDate" }
            },
            orderStatus: 1,
            totalAmount: 1,
            orderDate: 1
          }
        },
        {
          $group: {
            _id: {
              date: "$formattedDate",
              status: "$orderStatus"
            },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" }
          }
        },
        { $sort: { "_id.date": 1, "_id.status": 1 } }
      ];
    }

    // Log aggregation query
    console.log("Aggregation Query:", JSON.stringify(aggregationQuery, null, 2));

    const stats = await Order.aggregate(aggregationQuery);

    if (!stats || stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có dữ liệu thống kê cho khoảng thời gian này",
      });
    }

    // Gắn thêm field `month` nếu cần (trong response)
    const enhancedStats = stats.map(item => ({
      ...item,
      month: item._id.month || moment(item._id.date, "DD/MM/YYYY").format("MM/YYYY")
    }));

    console.log("Kết quả thống kê:", JSON.stringify(enhancedStats, null, 2));

    res.status(200).json({
      success: true,
      data: enhancedStats
    });

  } catch (e) {
    console.log("Lỗi khi lấy thống kê:", e);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy thống kê",
    });
  }
};


module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getOrderStatistics
};
