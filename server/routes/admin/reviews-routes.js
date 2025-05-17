const express = require("express");

const {
  getAllReviews,
  deleteReviewByID,
  toggleReviewVisibility
} = require("../../controllers/admin/reviews-controller");

const router = express.Router();

router.get("/get", getAllReviews);
router.delete("/delete/:id", deleteReviewByID);
router.put("/put/:id", toggleReviewVisibility);

module.exports = router;
