import Address from "@/components/shopping-view/address";
import img from "../../assets/slider_1.webp";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

function ShoppingCheckout() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();

  const now = new Date();
  const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const totalCartAmount =
    cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title:
          "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để tiếp tục!",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Vui lòng chọn một địa chỉ để tiếp tục!",
        variant: "destructive",
      });

      return;
    }
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        city: currentSelectedAddress?.city,
        district: currentSelectedAddress?.district,
        ward: currentSelectedAddress?.ward,
        address: currentSelectedAddress?.address,
        phone: currentSelectedAddress?.phone,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: vietnamTime,
      orderUpdateDate: vietnamTime,

      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }
  console.log(currentSelectedAddress);

  return (
    <div className="flex flex-col">
      <div className="relative h-[250px] w-full overflow-hidden rounded-xl shadow-md">
        <img
          src={img}
          alt="Banner"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-4 md:px-10">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Giỏ hàng của bạn</h2>
            {cartItems?.items?.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.items.map((item) => (
                  <UserCartItemsContent key={item._id} cartItem={item} />
                ))}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">
                  Chưa có sản phẩm nào trong giỏ hàng.
                </p>
                <Button
                  className="w-full mt-4 text-base py-6 bg-primary text-white hover:opacity-90"
                  onClick={() => navigate("/shop/listing")}
                >
                  Quay lại xem sản phẩm
                </Button>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t font-semibold text-base">
              <span>Tổng cộng:</span>
              <span>${totalCartAmount.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-4 text-base py-6">
              Thanh toán khi nhận hàng
            </Button>

            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full mt-4 text-base py-6"
            >
              {isPaymentStart
                ? "🔄 Đang xử lý thanh toán Paypal..."
                : "💳 Thanh toán bằng Paypal"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
