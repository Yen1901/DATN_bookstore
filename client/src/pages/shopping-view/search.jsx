import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productDetails } = useSelector((state) => state.shopProducts);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Chỉ thêm được tối đa ${getQuantity} sản phẩm này.`,
            variant: "destructive",
          });

          return;
        }
      }
    }

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

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Tìm kiếm sản phẩm..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-xl bg-blue-50 border border-blue-200 shadow-lg max-w-lg mx-auto">
          <div className="text-7xl mb-5 animate-bounce">🔎</div>
          <h1 className="text-3xl font-semibold text-blue-700 mb-2">
            Không tìm thấy kết quả
          </h1>
          <p className="text-blue-600 text-center max-w-sm">
            Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa
            của bạn. Vui lòng thử lại với từ khóa khác hoặc kiểm tra lại chính
            tả nhé!
          </p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
export default SearchProducts;
