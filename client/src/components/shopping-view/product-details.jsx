import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { MessageCircleOff, ShoppingCart } from "lucide-react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { reviews } = useSelector((state) => state.shopReview);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const description = productDetails?.description || "";
  const maxLength = 150;

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Bạn đã thêm bình luận thành công!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const shouldTruncate = description.length > maxLength;
  const displayedText = showFullDescription
    ? description
    : description.slice(0, maxLength);

  console.log(reviews, "reviews");

  const visibleReviews = reviews?.filter((r) => r.isVisible) || [];

  const averageReview =
    visibleReviews.length > 0
      ? visibleReviews.reduce((sum, r) => sum + r.reviewValue, 0) /
        visibleReviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight leading-tight">
              {productDetails?.title}
            </h1>

            <p className="text-base text-gray-600 mb-5 mt-4 leading-relaxed">
              {displayedText}
              {shouldTruncate && !showFullDescription && "... "}
              {shouldTruncate && (
                <span
                  onClick={toggleDescription}
                  className="text-blue-500 underline cursor-pointer text-base"
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-sm text-gray-500 ml-1">
              {averageReview.toFixed(2)} ⭐
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Hết hàng
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                <ShoppingCart className="w-4 h-4" />
                Thêm vào giỏ hàng
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Bình luận</h2>
            <div className="grid gap-6">
              {reviews && reviews.filter((r) => r.isVisible).length > 0 ? (
                reviews
                  .filter((r) => r.isVisible)
                  .map((reviewItem) => (
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                          />
                        </div>
                        <p className="text-muted-foreground">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground mt-6">
                  <MessageCircleOff className="w-10 h-10 mb-2 text-gray-400" />
                  <h3 className="text-lg font-semibold">
                    Không có bình luận nào 😔
                  </h3>
                  <p className="text-sm">
                    Hãy là người đầu tiên chia sẻ cảm nghĩ của bạn!
                  </p>
                </div>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Viết bình luận</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Viết bình luận tại đây..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Gửi
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ProductDetailsDialog;
