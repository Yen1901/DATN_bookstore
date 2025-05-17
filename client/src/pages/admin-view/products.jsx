import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  author: "",
  description: "",
  category: "",
  publisher: "",
  language: "",
  pages: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          console.log(data);
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Thêm thành công!",
            });
          }
        });
  }

  // function handleDelete(getCurrentProductId) {
  //   dispatch(deleteProduct(getCurrentProductId)).then((data) => {
  //     if (data?.payload?.success) {
  //       dispatch(fetchAllProducts());
  //     }
  //   });
  // }

  function handleDelete(productId) {
    setProductToDelete(productId);
    setOpenDeleteDialog(true);
  }

  function confirmDelete() {
    if (!productToDelete) return;

    dispatch(deleteProduct(productToDelete)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Xóa thành công!" });
      }
      setOpenDeleteDialog(false);
      setProductToDelete(null);
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const totalPages = Math.ceil(productList.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = productList.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) => (
      <Button
        key={index}
        size="sm"
        variant={page === currentPage ? "default" : "outline"}
        className="w-10 h-10 rounded-full"
        disabled={page === "..."}
        onClick={() => typeof page === "number" && goToPage(page)}
      >
        {page}
      </Button>
    ));
  };

  console.log(productList, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Thêm sản phẩm
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {currentProducts && currentProducts.length > 0
          ? currentProducts.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                // handleDelete={handleDelete}
                handleDelete={() => handleDelete(productItem._id)}
              />
            ))
          : null}
      </div>
      <div className="flex justify-center items-center mt-4 gap-2">
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ←
        </Button>
        {renderPageNumbers()}
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          →
        </Button>
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Sửa" : "Thêm"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn chắc chắn muốn xóa sản phẩm này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Dữ liệu sản phẩm sẽ bị xóa vĩnh
              viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-800 rounded-md px-4 py-2 transition-all duration-200 shadow-md hover:scale-105">
              Hủy
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#dc2626] hover:bg-[#cf0606] text-white rounded-md px-4 py-2 transition-all duration-200 shadow-md hover:scale-105"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}
export default AdminProducts;
