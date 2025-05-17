export const registerFormControls = [
  {
    name: "userName",
    label: "Họ tên",
    placeholder: "Nhập họ tên",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Tiêu đề",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Nhập tiêu đề sách",
  },
  {
    label: "Tác giả",
    name: "author",
    componentType: "input",
    type: "text",
    placeholder: "Nhập tên tác giả",
  },
  {
    label: "Mô tả",
    name: "description",
    componentType: "textarea",
    placeholder: "Nhập mô tả sách",
  },
  {
    label: "Thể loại",
    name: "category",
    componentType: "select",
    options: [
      { id: "vanhoc", label: "Văn học" },
      { id: "kinhte", label: "Kinh tế" },
      { id: "tieuthuyet", label: "Tiểu thuyết" },
      { id: "truyentranh", label: "Truyện tranh" },
      { id: "tamly", label: "Tâm lý" },
      { id: "truyenngan", label: "Truyện ngắn" },
      { id: "nhatky", label: "Nhật ký" },
      { id: "giaoduc", label: "Giáo dục" },
    ],
  },
  {
    label: "Nhà xuất bản",
    name: "publisher",
    componentType: "input",
    type: "text",
    placeholder: "Nhập tên NXB",
  },
  {
    label: "Ngôn ngữ",
    name: "language",
    componentType: "select",
    options: [
      { id: "english", label: "Tiếng Anh" },
      { id: "vietnamese", label: "Tiếng Việt" },
      { id: "chinese", label: "Trung - Việt" },
      { id: "japanese", label: "Nhật - Việt" },
      { id: "german", label: "Đức - Việt" },
    ],
  },
  {
    label: "Số trang",
    name: "pages",
    componentType: "input",
    type: "number",
    placeholder: "Nhập trang sách",
  },
  {
    label: "Giá",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Nhập giá tiền",
  },
  {
    label: "Giảm giá",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Nhập giảm giá",
  },
  {
    label: "Số lượng",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Nhập số lượng hàng",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Trang chủ",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Sản phẩm",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Tìm kiếm",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  vanhoc: "Văn học",
  kinhte: "Kinh tế",
  tieuthuyet: "Tiểu thuyết",
  truyentranh: "Truyện tranh",
  tamly: "Tâm lý",
  truyenngan: "Truyện ngắn",
  nhatky: "Nhật ký",
  giaoduc: "Giáo dục",
};

export const languageOptionsMap = {
  english: "Tiếng Anh",
  vietnamese: "Tiếng Việt",
  chinese: "Trung - Việt",
  japanese: "Nhật - Việt",
  german: "Đức - Việt",
};

export const filterOptions = {
  category: [
    { id: "vanhoc", label: "Văn học" },
    { id: "kinhte", label: "Kinh tế" },
    { id: "tieuthuyet", label: "Tiểu thuyết" },
    { id: "truyentranh", label: "Truyện tranh" },
    { id: "tamly", label: "Tâm lý" },
    { id: "truyenngan", label: "Truyện ngắn" },
    { id: "nhatky", label: "Nhật ký" },
    { id: "giaoduc", label: "Giáo dục" },
    
  ],
  language: [
    { id: "english", label: "Tiếng Anh" },
    { id: "vietnamese", label: "Tiếng Việt" },
    { id: "chinese", label: "Trung - Việt" },
    { id: "japanese", label: "Nhật - Việt" },
    { id: "german", label: "Đức - Việt" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Giá: thấp -> cao" },
  { id: "price-hightolow", label: "Giá: cao -> thấp" },
  { id: "title-atoz", label: "Ký tự: A -> Z" },
  { id: "title-ztoa", label: "Ký tự: Z -> A" },
];

export const addressFormControls = [
  {
    label: "TP/Tỉnh",
    name: "city",
    componentType: "select",
    placeholder: "Chọn TP/Tỉnh",
    options: [], 
  },
  {
    label: "Quận/Huyện",
    name: "district",
    componentType: "select",
    placeholder: "Chọn Quận/Huyện",
    options: [],
  },
  {
    label: "Phường/Xã",
    name: "ward",
    componentType: "select",
    placeholder: "Chọn Phường/Xã",
    options: [], 
  },
  {
    label: "Địa chỉ cụ thể",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Nhập địa chỉ cụ thể",
  },
  {
    label: "Số điện thoại",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Nhập số điện thoại",
  }
];
