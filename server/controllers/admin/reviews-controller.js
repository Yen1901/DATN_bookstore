const Review = require("../../models/Review");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("productId", "title")
      .sort({ createdAt: -1 });
    if (!reviews.length) {
      return res.status(404).json({
        success: false,
        message: "Không có bình luận nào!",
      });
    }
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

const deleteReviewByID = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bình luận",
      });
    else {
      res.status(200).json({
        success: true,
        message: "Xóa bình luận thành công!",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bình luận",
      });
    }

    review.isVisible = !review.isVisible;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Đã ${review.isVisible ? "hiện" : "ẩn"} bình luận thành công!`,
      data: review,
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
  getAllReviews,
  deleteReviewByID,
  toggleReviewVisibility,
};
