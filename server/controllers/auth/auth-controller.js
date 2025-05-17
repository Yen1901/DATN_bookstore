const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "Email đã tồn tại! Vui lòng thử lại.",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Đăng ký thành công!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "Tài khoản không tồn tại! Vui lòng đăng nhập lại",
      });
    if (!checkUser.isActive)
      return res.json({
        success: false,
        message:
          "Tài khoản của bạn đã bị khóa.",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Mật khẩu sai! Vui lòng nhập lại",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

//logout
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Đăng xuất thành công",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Người dùng chưa được xác thực!",
    });
  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;

    const user = await User.findById(decoded.id);
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Tài khoản của bạn đã bị khóa",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Người dùng chưa được xác thực!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
