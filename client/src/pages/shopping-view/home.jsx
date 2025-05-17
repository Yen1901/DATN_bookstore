import { useEffect, useState } from "react";
import bannerOne from "../../assets/slider_1.webp";
import bannerTwo from "../../assets/slider_3.webp";
import bannerThree from "../../assets/slider_4.webp";
import bannerFour from "../../assets/slider_5.webp";
import { Button } from "@/components/ui/button";
import {
  BookOpenText,
  ChartSpline,
  ChevronLeftIcon,
  ChevronRightIcon,
  GraduationCap,
  HeartPulse,
  LibraryBig,
  NotebookPen,
  NotebookText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";

const categoriesWithIcon = [
  { id: "vanhoc", label: "Văn học", icon: LibraryBig },
  { id: "kinhte", label: "Kinh tế", icon: ChartSpline },
  { id: "tieuthuyet", label: "Tiểu thuyết", icon: LibraryBig },
  { id: "truyentranh", label: "Truyện tranh", icon: BookOpenText },
  { id: "tamly", label: "Tâm lý", icon: HeartPulse },
  { id: "truyenngan", label: "Truyện ngắn", icon: NotebookText },
  { id: "nhatky", label: "Nhật ký", icon: NotebookPen },
  { id: "giaoduc", label: "Giáo dục", icon: GraduationCap },
];

const languagesWithIcon = [
  { id: "english", label: "Tiếng Anh", icon: "EN" },
  { id: "vietnamese", label: "Tiếng Việt", icon: "VI" },
  { id: "chinese", label: "Trung - Việt", icon: "ZH-VI" },
  { id: "japanese", label: "Nhật - Việt", icon: "JA-VI" },
  { id: "german", label: "Đức - Việt", icon: "DE-VI" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const slides = [bannerOne, bannerTwo, bannerThree, bannerFour];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Sản phẩm đã được thêm vào giỏ hàng!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log("Toàn bộ đơn hàng: ", orderList);

  const productSalesCount = {};

  orderList
    .filter((order) => order.orderStatus === "delivered")
    .forEach((order) => {
      order.cartItems.forEach((item) => {
        if (productSalesCount[item.productId]) {
          productSalesCount[item.productId].totalQuantity += item.quantity;
        } else {
          productSalesCount[item.productId] = {
            productId: item.productId,
            title: item.title,
            image: item.image,
            totalQuantity: item.quantity,
            price: item.price,
          };
        }
      });
    });

  const topSellingProducts = Object.values(productSalesCount)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 4);

  topSellingProducts.forEach((product) => {
    console.log(`Sản phẩm bán chạy nhất:`);
    console.log(`Sản phẩm ID: ${product.productId}`);
    console.log(`Tên sản phẩm: ${product.title}`);
    console.log(`Ảnh sản phẩm: ${product.image}`);
    console.log(`Giá sản phẩm: ${product.price}`);

    console.log(`Số lượng bán: ${product.totalQuantity}`);
    console.log("------------------------");
  });

  console.log(productList);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[400px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${index === currentSlide ? "opacity-100" : "opacity-0"}
                absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Thể loại</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Card
                  key={categoryItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer hover:shadow-xl transition duration-300 border border-gray-200 rounded-2xl bg-white"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="w-14 h-14 flex items-center justify-center mb-4 bg-blue-100 text-primary rounded-full shadow-md">
                      <categoryItem.icon className="w-8 h-8" />
                    </div>
                    <span className="font-semibold text-center text-gray-800">
                      {categoryItem.label}
                    </span>
                  </CardContent>
                </Card>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Ngôn ngữ</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {languagesWithIcon.map((languageItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(languageItem, "language")
                }
                key={languageItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Card
                  key={languageItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(languageItem, "language")
                  }
                  className="cursor-pointer hover:shadow-xl transition duration-300 border border-gray-200 rounded-2xl bg-white"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-lg hover:scale-105 transition-transform">
                      {languageItem.icon}
                    </div>
                    <span className="font-semibold text-center text-gray-800">
                      {languageItem.label}
                    </span>
                  </CardContent>
                </Card>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Sản phẩm bán chạy nhất
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topSellingProducts.map((product) => {
              return (
                <Card
                  key={product.productId}
                  className="p-4 hover:shadow-lg transition-shadow flex flex-col"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-primary font-bold text-base">
                    ${product.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Đã bán: {product.totalQuantity}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
export default ShoppingHome;
