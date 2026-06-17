import * as Yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { RHFInput, RHFTextArea } from "@/components/form";

import CardWrapper from "@/components/shared/CardWrapper";
import CustomHeader from "@/components/page-heading/CustomHeader";
import CircularLoading from "@/components/shared/CircularLoading";

import {
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/redux/features/product/productApi";
import { cleanPayload } from "@/utils/clean-payload";

export default function ProductForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

  const [imagePreview, setImagePreview] = useState("");

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [createProduct, { _isLoading }] = useCreateProductMutation();

  const [updateProduct, { isLoading: _updateLoading }] =
    useUpdateProductMutation();

  const { data: currentProduct, isLoading: currentProductLoading } =
    useGetProductByIdQuery(id, { skip: !id });

  const ProductSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string()
        .trim()
        .required("Product name is required")
        .min(3, "Product name must be at least 3 characters"),

      description: Yup.string().trim(),

      sku: Yup.string()
        .trim()
        .required("SKU is required")
        .matches(
          /^[A-Za-z0-9_-]+$/,
          "SKU can only contain letters, numbers, dashes, and underscores"
        ),

      price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required")
        .positive("Price must be a positive number"),
      ...(isEdit
        ? {}
        : {
            stock: Yup.number()
              .typeError("Stock must be a number")
              .required("Current stock is required")
              .min(0, "Stock cannot be negative"),
          }),
    });
  }, [isEdit]);

  const defaultValues = {
    name: "",
    description: "",
    sku: "",
    price: "",
    stock: "",
  };

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProduct?.data && isEdit) {
      reset({
        name: currentProduct?.data?.name || "",
        description: currentProduct?.data?.description || "",
        sku: currentProduct?.data?.sku || "",
        price: currentProduct?.data?.price || "",
        stock: currentProduct?.data?.stock || "",
      });
    }
  }, [currentProduct, isEdit, reset]);

  useEffect(() => {
    if (currentProduct?.data?.image && isEdit) {
      setImagePreview(currentProduct.data.image);
    }
  }, [currentProduct?.data?.image, isEdit]);

  // Handle image file change for preview
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    const maxSize = 1024 * 1024;

    if (file) {
      if (file.size > maxSize) {
        toast.error("Image must be less than 1MB");
        return;
      }

      setSelectedImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const cleanData = cleanPayload(data);

    const action = isEdit ? updateProduct : createProduct;
    let imageUrl = imagePreview;

    if (selectedImageFile) {
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImageFile);
      imageFormData.append("key", import.meta.env.VITE_IMGBB_API_KEY);

      try {
        const response = await fetch(import.meta.env.VITE_IMGBB_UPLOAD_URL, {
          method: "POST",
          body: imageFormData,
        });

        if (!response.ok) {
          throw new Error(`Image upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          imageUrl = result.data.url;
          toast.success("Image uploaded successfully!");
        } else {
          throw new Error(`ImgBB API error: ${result.error.message}`);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
        return;
      }
    }

    const payload = isEdit
      ? { data: { ...cleanData, image: imageUrl }, productId: id }
      : { ...cleanData, ...(imageUrl ? { image: imageUrl } : {}) };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await action(payload).unwrap();

      if (result.success) {
        toast.success(
          result.message ||
            (isEdit
              ? "Product updated successfully"
              : "Product added successfully")
        );

        if (!isEdit) reset();

        navigate("/products");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <CustomHeader
        title="Product"
        subtitle={
          isEdit ? "Edit your existing product" : "Create a new product"
        }
      />

      {currentProductLoading ? (
        <CircularLoading />
      ) : (
        <CardWrapper>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-muted shadow-sm">
                  <img
                    src={
                      selectedImageFile
                        ? imagePreview
                        : isEdit && currentProduct?.data?.image
                        ? currentProduct.data.image
                        : "/product-img-placeholder.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label className="mt-2 cursor-pointer text-sm font-medium text-primary hover:underline">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  Upload Product Image
                </label>

                <p className="text-xs text-muted-foreground">
                  Max file size: 1MB
                </p>
              </div>

              <RHFInput
                name="name"
                label="Product name *"
                type="text"
                placeholder="Enter product name"
              />

              <RHFTextArea
                name="description"
                label="Description (optional)"
                placeholder="Enter product description"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFInput
                  name="sku"
                  label="SKU *"
                  type="text"
                  placeholder="Enter product code"
                  disabled={isEdit}
                />

                <RHFInput
                  name="price"
                  label="Price *"
                  type="number"
                  placeholder="Enter product price"
                />
              </div>

              <RHFInput
                name="stock"
                label="Current stock *"
                type="number"
                placeholder="Enter current stock"
                disabled={isEdit}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="custom-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEdit
                    ? "Update"
                    : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardWrapper>
      )}
    </>
  );
}
