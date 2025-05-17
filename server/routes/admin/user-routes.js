const express = require("express");

const {
  getAllUsers,
  getUserByID,
  updateUserStatus
} = require("../../controllers/admin/user-controller");

const router = express.Router();

router.get("/get", getAllUsers);
router.get("/get/:id", getUserByID);
router.put("/update/:id", updateUserStatus);

module.exports = router;