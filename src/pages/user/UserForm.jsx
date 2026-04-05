import * as Yup from "yup";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RHFInput, RHFSelect } from "@/components/form";
import { GENDER_OPTIONS, USER_ROLE_OPTIONS } from "@/constants";

import CardWrapper from "@/components/shared/CardWrapper";
import CustomHeader from "@/components/page-heading/CustomHeader";
import CircularLoading from "@/components/shared/CircularLoading";

import {
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";

export default function UserForm({ mode = "create", userData = null }) {
  const { id } = useParams();

  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState("");

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // FORM MODE
  const isEdit = mode === "edit";
  const isProfile = mode === "profile";
  const isCreate = mode === "create";

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Fetch current user only in edit mode
  const { data: fetchedData, isLoading } = useGetUserByIdQuery(id, {
    skip: !id || !isEdit,
    forceRefetch: true,
  });

  const currentUser = isCreate ? null : isProfile ? userData : fetchedData;

  const UserSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().trim().required("Name is required"),
      address: Yup.string().trim(),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .trim()
        .matches(
          /^01[0-9]{9}$/,
          "Phone number must be a valid 11-digit Bangladeshi number"
        )
        .required("Phone number is required"),
      role: Yup.string()
        .required("Please select the user's role")
        .notOneOf([""], "Please select the user's role"),
      gender: Yup.string()
        .required("Please select gender")
        .notOneOf([""], "Please select gender"),
      ...(isCreate && {
        password: Yup.string().trim().required("Initial password is required"),
      }),
    });
  }, [isCreate]);

  const defaultValues = {
    name: "",
    address: "",
    email: "",
    phone: "",
    role: "",
    gender: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if ((isEdit || isProfile) && currentUser?.data) {
      reset({
        name: currentUser.data.name || "",
        address: currentUser.data.address || "",
        email: currentUser.data.email || "",
        phone: currentUser.data.phone || "",
        role: currentUser.data.role || "",
        gender: currentUser.data.gender || "",
      });
    }
  }, [currentUser?.data, reset, isEdit, isProfile]);

  useEffect(() => {
    if ((isEdit || isProfile) && currentUser?.data?.image) {
      setImagePreview(currentUser.data.image);
    }
  }, [currentUser?.data, isEdit, isProfile]);

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

  const onSubmit = async (formData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let result;

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

      if (isEdit || isProfile) {
        delete formData.password;
        result = await updateUser({
          data: { ...formData, image: imageUrl },
          userId: isProfile ? userData?.data?.id : id,
        }).unwrap();
      } else {
        result = await createUser({ ...formData, image: imageUrl }).unwrap();
      }

      if (result.success) {
        toast.success(result?.message || "User saved successfully");
        reset();

        if (!isProfile) navigate("/users");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      {!isProfile && (
        <CustomHeader
          title="User"
          subtitle={isEdit ? "Edit existing user" : "Create a new user"}
        />
      )}

      <CardWrapper>
        {isEdit && isLoading ? (
          <CircularLoading />
        ) : (
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-muted shadow-sm">
                  <img
                    src={imagePreview || "/product-img-placeholder.jpg"}
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
                  Upload Profile Photo
                </label>

                <p className="text-xs text-muted-foreground">
                  Max file size: 1MB
                </p>
              </div>

              <RHFInput
                name="name"
                label="User's Full Name *"
                type="text"
                placeholder="Enter full name"
              />

              <RHFInput
                name="address"
                label="Address (optional)"
                type="text"
                placeholder="Enter address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFInput
                  name="email"
                  label="Email *"
                  type="email"
                  placeholder="Enter email"
                  disabled={isEdit || isProfile}
                />

                <RHFInput
                  name="phone"
                  label="Phone *"
                  type="tel"
                  placeholder="Enter phone number"
                />

                <RHFSelect
                  name="role"
                  label="Role *"
                  placeholder="Select role"
                  options={USER_ROLE_OPTIONS}
                  disabled={isProfile}
                />

                <RHFSelect
                  name="gender"
                  label="Gender *"
                  placeholder="Select gender"
                  options={GENDER_OPTIONS}
                />
              </div>

              {isCreate && (
                <RHFInput
                  name="password"
                  label="Password *"
                  type="password"
                  placeholder="Enter initial password"
                />
              )}

              <div className="flex justify-end gap-4">
                {!isProfile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/users")}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="submit"
                  className="custom-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEdit || isProfile
                    ? "Update"
                    : "Create User"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardWrapper>
    </>
  );
}
