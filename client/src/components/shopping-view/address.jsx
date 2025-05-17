import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import { useToast } from "@/hooks/use-toast";
import AddressCard from "./address-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const initialAddressFormData = {
  city: "",
  district: "",
  ward: "",
  address: "",
  phone: "",
};

function Address({ setCurrentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { addressList } = useSelector((state) => state.shopAddress);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // State để theo dõi địa chỉ được chọn

  function handleSelectAddress(addressInfo) {
    setSelectedAddressId(addressInfo._id); 
    setCurrentSelectedAddress(addressInfo); 
  }

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "Bạn có thể thêm tối đa 3 địa chỉ.",
        variant: "destructive",
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({ title: "Cập nhật địa chỉ thành công!" });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({ title: "Thêm địa chỉ thành công!" });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Xóa địa chỉ thành công!",
        });
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);

    setFormData({
      ...formData,
      city: getCurrentAddress?.city,
      district: getCurrentAddress?.district,
      ward: getCurrentAddress?.ward,
      address: getCurrentAddress?.address,
      phone: getCurrentAddress?.phone,
    });

    const selectedCity = cities.find(
      (city) => city.label === getCurrentAddress.city
    );
    if (selectedCity) {
      const newDistricts = selectedCity.districts.map((d) => ({
        label: d.name,
        value: d.code,
        wards: d.wards,
      }));
      setDistricts(newDistricts);

      const selectedDistrict = newDistricts.find(
        (d) => d.label === getCurrentAddress.district
      );
      if (selectedDistrict) {
        const newWards = selectedDistrict.wards.map((w) => ({
          label: w.name,
          value: w.code,
        }));
        setWards(newWards);
      } else {
        setWards([]);
      }
    } else {
      setDistricts([]);
      setWards([]);
    }
  }

  function isFormValid() {
    return Object.values(formData).every((value) =>
      typeof value === "string" ? value.trim() !== "" : false
    );
  }

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data) => {
        setCities(
          data.map((city) => ({
            label: city.name,
            value: city.code,
            districts: city.districts,
          }))
        );
      });
  }, []);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user?.id));
    }
  }, [dispatch, user?.id]);

  function handleCityChange(cityCode) {
    const selectedCity = cities.find(
      (city) => String(city.value) === String(cityCode)
    );

    if (selectedCity) {
      setFormData({
        ...formData,
        city: selectedCity.label,
        district: "",
        ward: "",
      });

      setDistricts(
        selectedCity.districts.map((district) => ({
          label: district.name,
          value: district.code,
          wards: district.wards,
        }))
      );

      setWards([]);
    }
  }

  function handleDistrictChange(districtCode) {
    const selectedDistrict = districts.find(
      (d) => String(d.value) === String(districtCode)
    );

    if (selectedDistrict) {
      setFormData({
        ...formData,
        district: selectedDistrict.label,
        ward: "",
      });

      setWards(
        selectedDistrict.wards.map((w) => ({
          label: w.name,
          value: w.code,
        }))
      );
    }
  }

  function handleWardChange(wardCode) {
    const selectedWard = wards.find(
      (w) => String(w.value) === String(wardCode)
    );

    if (selectedWard) {
      setFormData({
        ...formData,
        ward: selectedWard.label,
      });
    }
  }

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden p-4 bg-white">
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              handleDeleteAddress={handleDeleteAddress}
              // setCurrentSelectedAddress={setCurrentSelectedAddress}
              setCurrentSelectedAddress={handleSelectAddress} 
              isSelected={singleAddressItem._id === selectedAddressId} 
            />
          ))
        ) : (
          <div className="col-span-full text-center border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
              <span className="text-4xl">📭</span>
              <p className="text-lg font-medium">Chưa có địa chỉ nào</p>
              <p className="text-sm text-gray-500">
                Vui lòng thêm địa chỉ để tiếp tục đặt hàng
              </p>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {currentEditedId !== null ? "Sửa địa chỉ" : "Thêm địa chỉ"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 p-4 bg-white rounded-b-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            onValueChange={handleCityChange}
            value={
              cities
                .find((c) => c.label === formData.city)
                ?.value?.toString() || ""
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn TP/Tỉnh" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.value} value={c.value.toString()}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleDistrictChange}
            value={
              districts
                .find((d) => d.label === formData.district)
                ?.value?.toString() || ""
            }
            disabled={!formData.city}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn Quận/Huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.value} value={d.value.toString()}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleWardChange}
            value={
              wards.find((w) => w.label === formData.ward)?.value?.toString() ||
              ""
            }
            disabled={!formData.district}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn Phường/Xã" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.value} value={w.value.toString()}>
                  {w.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CommonForm
          formControls={addressFormControls.filter(
            (c) => !["city", "district", "ward"].includes(c.name)
          )}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Sửa" : "Thêm"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
