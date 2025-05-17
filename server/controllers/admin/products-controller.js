const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      author,
      description,
      category,
      publisher,
      language,
      pages,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      author,
      description,
      category,
      publisher,
      language,
      pages,
      price,
      salePrice,
      totalStock,
    });
    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      author,
      description,
      category,
      publisher,
      language,
      pages,
      price,
      salePrice,
      totalStock,
    } = req.body;
    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    findProduct.title = title || Product.title;
    findProduct.author = author || Product.title;
    findProduct.description = description || Product.title;
    findProduct.category = category || Product.title;
    findProduct.publisher = publisher || Product.title;
    findProduct.language = language || Product.title;
    findProduct.pages = pages || Product.title;
    findProduct.price = price === "" ? 0 : price || Product.title;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || Product.title;
    findProduct.price = price || Product.title;
    findProduct.totalStock = totalStock || Product.title;
    findProduct.image = image || Product.title;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    else {
      res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công!",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Xảy ra lỗi!",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
