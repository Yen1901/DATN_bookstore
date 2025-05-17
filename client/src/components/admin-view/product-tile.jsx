import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 line-clamp-2 min-h-[56px]">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
          {product?.totalStock > 0 ? (
            <Badge className="bg-green-100 text-green-700 border border-green-300">
              Còn {product?.totalStock} sản phẩm
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700 border border-red-300">
              Hết hàng
            </Badge>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Sửa
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Xóa</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
export default AdminProductTile;
