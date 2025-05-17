import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  isSelected,  
}) {
  return (
    <Card
      onClick={() => setCurrentSelectedAddress(addressInfo)}
      className={`w-full bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 
        ${isSelected ? 'border-4 border-bg-primary' : ''}  // Thêm viền đậm khi địa chỉ được chọn`}
    >
      <CardContent className="p-6 space-y-4">
        <div className="text-lg font-semibold text-gray-800">
          <Label className="block text-sm font-medium text-gray-600">
            TP/Tỉnh:
          </Label>
          <p>{addressInfo?.city}</p>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          <Label className="block text-sm font-medium text-gray-600">
            Quận/Huyện:
          </Label>
          <p>{addressInfo?.district}</p>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          <Label className="block text-sm font-medium text-gray-600">
            Phường/Xã:
          </Label>
          <p>{addressInfo?.ward}</p>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          <Label className="block text-sm font-medium text-gray-600">
            Địa chỉ cụ thể:
          </Label>
          <p>{addressInfo?.address}</p>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          <Label className="block text-sm font-medium text-gray-600">
            Số điện thoại:
          </Label>
          <p>{addressInfo?.phone}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-100 flex justify-between rounded-b-lg">
        <Button
          onClick={() => handleEditAddress(addressInfo)}
          className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
        >
          Sửa
        </Button>
        <Button
          onClick={() => handleDeleteAddress(addressInfo)}
          className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
        >
          Xóa
        </Button>
      </CardFooter>
    </Card>
  );
}
export default AddressCard;
