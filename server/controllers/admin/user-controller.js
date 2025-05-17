const User = require("../../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Không có tài khoản nào!",
      });
    }
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { role, isActive } = req.body;

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ. Chỉ có thể là 'user' hoặc 'admin'.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái người dùng thành công!",
      data: updatedUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserByID,
  updateUserStatus,
};
