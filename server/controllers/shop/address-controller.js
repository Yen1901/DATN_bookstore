const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, city, district, ward, address, phone } = req.body;

    if (!userId || !city || !district || !ward || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin địa chỉ!",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      city,
      district,
      ward,
      address,
      phone,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm địa chỉ.",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId!",
      });
    }

    const addressList = await Address.find({ userId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách địa chỉ.",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId hoặc addressId!",
      });
    }

    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ.",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật địa chỉ.",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId hoặc addressId!",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xoá địa chỉ thành công.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xoá địa chỉ.",
    });
  }
};

module.exports = {
  addAddress,
  editAddress,
  fetchAllAddress,
  deleteAddress,
};
