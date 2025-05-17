import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteReviewByID,
  getAllReviews,
  toggleReviewVisibility,
} from "@/store/admin/reviews-slice";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { StarIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";

function AdminReviewsView() {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.adminReviews);

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  function handleDelete(id) {
    dispatch(deleteReviewByID(id))
      .unwrap()
      .then(() => {
        dispatch(getAllReviews());
      })
      .catch((error) => {
        console.error("Lỗi khi xóa bình luận:", error);
      });
  }

  function handleToggleVisibility(id) {
    dispatch(toggleReviewVisibility(id))
      .unwrap()
      .then(() => {
        dispatch(getAllReviews());
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
      });
  }

  console.log(reviews);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          Bình luận
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 border-b">
              <TableHead className="text-center">Mã bình luận</TableHead>
              <TableHead className="text-center">Sản phẩm</TableHead>
              <TableHead className="text-center">Người dùng</TableHead>
              <TableHead className="text-center">Nội dung</TableHead>
              <TableHead className="text-center">Đánh giá</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review._id} className="border-b hover:bg-gray-50">
                <TableCell className="text-center text-sm text-gray-600">
                  <div
                    title={review._id}
                    className="truncate max-w-[120px] mx-auto"
                  >
                    {review._id.slice(0, 6)}...{review._id.slice(-4)}
                  </div>
                </TableCell>

                <TableCell className="text-center text-sm font-medium">
                  {review.productId?.title || "Không xác định"}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {review.userName}
                </TableCell>
                <TableCell className="text-center text-sm text-gray-700 max-w-[200px] truncate">
                  {review.reviewMessage}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.reviewValue
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        fill={i < review.reviewValue ? "#facc15" : "none"}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    className={`rounded-md ${
                      review.isVisible ? "bg-yellow-500" : "bg-gray-400"
                    } text-white hover:bg-yellow-400`}
                    onClick={() => handleToggleVisibility(review._id)}
                  >
                    {review.isVisible ? "Ẩn" : "Hiện"}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(review._id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminReviewsView;
