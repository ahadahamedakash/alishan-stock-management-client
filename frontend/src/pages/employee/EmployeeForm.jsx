import * as Yup from "yup";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

import { cleanPayload } from "@/utils/clean-payload";

import CardWrapper from "@/components/shared/CardWrapper";
import CustomHeader from "@/components/page-heading/CustomHeader";
import CircularLoading from "@/components/shared/CircularLoading";

import { Form } from "@/components/ui/form";
import { RHFDatePicker, RHFInput, RHFSelect } from "@/components/form";
import { EMPLOYEES_POSITION_OPTIONS, GENDER_OPTIONS } from "@/constants";

import {
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useCreateEmployeeMutation,
} from "@/redux/features/employee/employeeApi";

const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-([0-9]{4})$/;

const EmployeeSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(3, "Employee name must be at least 3 characters"),

  email: Yup.string().trim().email("Invalid email address"),

  phone: Yup.string()
    .trim()
    .matches(
      /^01[0-9]{9}$/,
      "Phone number must be a valid 11-digit Bangladeshi number"
    )
    .required("Phone number is required"),

  emergencyContact: Yup.string()
    .trim()
    .matches(
      /^01[0-9]{9}$/,
      "Phone number must be a valid 11-digit Bangladeshi number"
    )
    .required("Emergency contact is required"),

  position: Yup.string()
    .trim()
    .required("Please select employee's position")
    .notOneOf([""], "Please select employee's position"),

  gender: Yup.string()
    .trim()
    .required("Please select gender")
    .notOneOf([""], "Please select gender"),

  presentAddress: Yup.string().trim().required("Present address is required"),

  permanentAddress: Yup.string()
    .trim()
    .required("Permanent address is required"),

  monthlySalary: Yup.number()
    .typeError("Price must be a number")
    .required("Monthly salary is required")
    .positive("Monthly salary must be a positive number"),

  nidNumber: Yup.string()
    .trim()
    .required("NID/Birthregistration number is required"),

  // joiningDate: Yup.string().trim().required("Joining date is required"),

  // dateOfBirth: Yup.string().trim().required("Date of birth is required"),

  joiningDate: Yup.string()
    .trim()
    .required("Joining date is required")
    .matches(DATE_REGEX, "Date must be in DD-MM-YYYY format")
    .test("max-year", "Year cannot be greater than 2025", (value) => {
      if (!value) return false;
      const year = parseInt(value.split("-")[2], 10);
      return year <= 2025;
    }),

  dateOfBirth: Yup.string()
    .trim()
    .required("Date of birth is required")
    .matches(DATE_REGEX, "Date must be in DD-MM-YYYY format")
    .test("max-year", "Year cannot be greater than 2025", (value) => {
      if (!value) return false;
      const year = parseInt(value.split("-")[2], 10);
      return year <= 2025;
    }),
});

export default function EmployeeForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

  const [createEmployee, { _isLoading }] = useCreateEmployeeMutation();

  const [updateEmployee, { isLoading: _updateLoading }] =
    useUpdateEmployeeMutation();

  const { data: currentEmployee, isLoading: currentEmployeeLoading } =
    useGetEmployeeByIdQuery(id, { skip: !id });

  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    position: "",
    gender: "",
    presentAddress: "",
    permanentAddress: "",
    monthlySalary: "",
    nidNumber: "",
    joiningDate: "",
    dateOfBirth: "",
  };

  const methods = useForm({
    resolver: yupResolver(EmployeeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentEmployee?.data && isEdit) {
      reset({
        name: currentEmployee?.data?.name || "",
        email: currentEmployee?.data?.email || "",
        phone: currentEmployee?.data?.phone || "",
        emergencyContact: currentEmployee?.data?.emergencyContact || "",
        position: currentEmployee?.data?.position || "",
        gender: currentEmployee?.data?.gender || "",
        presentAddress: currentEmployee?.data?.presentAddress || "",
        permanentAddress: currentEmployee?.data?.permanentAddress || "",
        monthlySalary: currentEmployee?.data?.monthlySalary || "",
        nidNumber: currentEmployee?.data?.nidNumber || "",
        joiningDate: currentEmployee?.data?.joiningDate || "",
        dateOfBirth: currentEmployee?.data?.dateOfBirth || "",
      });
    }
  }, [currentEmployee, isEdit, reset]);

  const onSubmit = async (data) => {
    const cleanData = cleanPayload(data);

    const action = isEdit ? updateEmployee : createEmployee;

    const payload = isEdit ? { data: cleanData, employeeId: id } : cleanData;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await action(payload).unwrap();

      if (result.success) {
        toast.success(
          result.message ||
            (isEdit
              ? "Employee updated successfully"
              : "Employee added successfully")
        );

        if (!isEdit) reset();

        navigate("/employees");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <CustomHeader
        title="Employees"
        subtitle="Add a new worker to your workforce"
      />

      {currentEmployeeLoading ? (
        <CircularLoading />
      ) : (
        <CardWrapper>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <RHFInput
                name="name"
                label="Employee's full name *"
                placeholder="Enter full name"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RHFSelect
                  name="gender"
                  label="Gender *"
                  placeholder="Select gender"
                  options={GENDER_OPTIONS}
                />

                <RHFInput
                  name="email"
                  label="Email (optional)"
                  placeholder="Enter employee's email address"
                />

                <RHFInput
                  name="phone"
                  label="Contact No. *"
                  type="tel"
                  placeholder="Enter employee's phone"
                />

                <RHFInput
                  name="emergencyContact"
                  label="Emergency Contact No. *"
                  type="tel"
                  placeholder="Enter employee's emergency phone"
                />

                <RHFSelect
                  name="position"
                  label="Position *"
                  placeholder="Select position"
                  options={EMPLOYEES_POSITION_OPTIONS}
                />

                {/* <RHFDatePicker
                  name="joiningDate"
                  label="Joining date (DD-MM-YYYY) *"
                  restrictFuture={true}
                /> */}

                <RHFInput
                  name="joiningDate"
                  label="Joining date (DD-MM-YYYY) *"
                  placeholder="Enter joining date (DD-MM-YYYY)"
                />

                <RHFInput
                  name="monthlySalary"
                  label="Monthly salary *"
                  type="number"
                  placeholder="Enter monthly salary"
                  disabled={isEdit}
                />

                {/* <RHFDatePicker
                  name="dateOfBirth"
                  label="Date of birth (DD-MM-YYYY) *"
                  restrictFuture={true}
                /> */}

                <RHFInput
                  name="dateOfBirth"
                  label="Date of birth (DD-MM-YYYY) *"
                  placeholder="Enter dte of birth (DD-MM-YYYY)"
                />
              </div>

              <RHFInput
                name="nidNumber"
                label="NID/Birth Registration No. *"
                placeholder="Enter NID/Birth registration number"
              />

              <RHFInput
                name="presentAddress"
                label="Present address *"
                placeholder="Enter full address"
              />

              <RHFInput
                name="permanentAddress"
                label="Permanent address *"
                placeholder="Enter full address"
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/employees")}
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
                    : "Create Employee"}
                </Button>
              </div>
            </form>
          </Form>
        </CardWrapper>
      )}
    </>
  );
}

// import * as Yup from "yup";
// import { toast } from "react-hot-toast";
// import { useForm } from "react-hook-form";
// import { useEffect, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useNavigate, useParams } from "react-router-dom";

// import { cleanPayload } from "@/utils/clean-payload";

// import CardWrapper from "@/components/shared/CardWrapper";
// import CustomHeader from "@/components/page-heading/CustomHeader";
// import CircularLoading from "@/components/shared/CircularLoading";

// import { Form } from "@/components/ui/form";
// import { RHFDatePicker, RHFInput, RHFSelect } from "@/components/form";
// import { EMPLOYEES_POSITION_OPTIONS, GENDER_OPTIONS } from "@/constants";

// import {
//   useGetEmployeeByIdQuery,
//   useUpdateEmployeeMutation,
//   useCreateEmployeeMutation,
// } from "@/redux/features/employee/employeeApi";

// const EmployeeSchema = Yup.object().shape({
//   name: Yup.string()
//     .trim()
//     .required("Name is required")
//     .min(3, "Employee name must be at least 3 characters"),

//   email: Yup.string().trim().email("Invalid email address"),

//   phone: Yup.string()
//     .trim()
//     .matches(
//       /^01[0-9]{9}$/,
//       "Phone number must be a valid 11-digit Bangladeshi number"
//     )
//     .required("Phone number is required"),

//   emergencyContact: Yup.string()
//     .trim()
//     .matches(
//       /^01[0-9]{9}$/,
//       "Phone number must be a valid 11-digit Bangladeshi number"
//     )
//     .required("Emergency contact is required"),

//   position: Yup.string()
//     .trim()
//     .required("Please select employee's position")
//     .notOneOf([""], "Please select employee's position"),

//   gender: Yup.string()
//     .trim()
//     .required("Please select gender")
//     .notOneOf([""], "Please select gender"),

//   presentAddress: Yup.string().trim().required("Present address is required"),

//   permanentAddress: Yup.string()
//     .trim()
//     .required("Permanent address is required"),

//   monthlySalary: Yup.number()
//     .typeError("Price must be a number")
//     .required("Monthly salary is required")
//     .positive("Monthly salary must be a positive number"),

//   nidNumber: Yup.string()
//     .trim()
//     .required("NID/Birthregistration number is required"),

//   joiningDate: Yup.string().trim().required("Joining date is required"),

//   dateOfBirth: Yup.string().trim().required("Date of birth is required"),
// });

// export default function EmployeeForm() {
//   const navigate = useNavigate();

//   const { id } = useParams();

//   const isEdit = Boolean(id);

//   const [createEmployee] = useCreateEmployeeMutation();

//   const [updateEmployee, { isLoading: _updateLoading }] =
//     useUpdateEmployeeMutation();

//   const {
//     data: currentEmployee,
//     isLoading: currentEmployeeLoading,
//     isSuccess,
//   } = useGetEmployeeByIdQuery(id, { skip: !id });

//   // const defaultValues = {
//   //   name: "",
//   //   email: "",
//   //   phone: "",
//   //   emergencyContact: "",
//   //   position: "",
//   //   gender: "",
//   //   presentAddress: "",
//   //   permanentAddress: "",
//   //   monthlySalary: "",
//   //   nidNumber: "",
//   //   joiningDate: "",
//   //   dateOfBirth: "",
//   // };

//   const defaultValues = useMemo(() => {
//     if (isEdit && currentEmployee?.success) {
//       return {
//         name: currentEmployee?.data?.name || "",
//         email: currentEmployee?.data?.email || "",
//         phone: currentEmployee?.data?.phone || "",
//         emergencyContact: currentEmployee?.data?.emergencyContact || "",
//         position: currentEmployee?.data?.position || "",
//         gender: currentEmployee?.data?.gender || "",
//         presentAddress: currentEmployee?.data?.presentAddress || "",
//         permanentAddress: currentEmployee?.data?.permanentAddress || "",
//         monthlySalary: currentEmployee?.data?.monthlySalary || "",
//         nidNumber: currentEmployee?.data?.nidNumber || "",
//         joiningDate: currentEmployee?.data?.joiningDate || "",
//         dateOfBirth: currentEmployee?.data?.dateOfBirth || "",
//       };
//     }

//     return {
//       name: "",
//       email: "",
//       phone: "",
//       emergencyContact: "",
//       position: "",
//       gender: "",
//       presentAddress: "",
//       permanentAddress: "",
//       monthlySalary: "",
//       nidNumber: "",
//       joiningDate: "",
//       dateOfBirth: "",
//     };
//   }, [isEdit, currentEmployee]);

//   const methods = useForm({
//     resolver: yupResolver(EmployeeSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const values = methods.watch();
//   console.log("Current form values", values);

//   // console.log("DEFAULT VALUES: ", defaultValues);
//   // console.log("check employee: ", currentEmployee);

//   useEffect(() => {
//     if (currentEmployee?.success && isEdit && isSuccess) {
//       const values = {
//         name: currentEmployee?.data?.name || "",
//         email: currentEmployee?.data?.email || "",
//         phone: currentEmployee?.data?.phone || "",
//         emergencyContact: currentEmployee?.data?.emergencyContact || "",
//         position: currentEmployee?.data?.position || "",
//         gender: currentEmployee?.data?.gender || "",
//         presentAddress: currentEmployee?.data?.presentAddress || "",
//         permanentAddress: currentEmployee?.data?.permanentAddress || "",
//         monthlySalary: currentEmployee?.data?.monthlySalary || "",
//         nidNumber: currentEmployee?.data?.nidNumber || "",
//         joiningDate: currentEmployee?.data?.joiningDate || "",
//         dateOfBirth: currentEmployee?.data?.dateOfBirth || "",
//       };

//       reset(values);
//     }
//   }, [currentEmployee, isEdit, reset, isSuccess]);

//   const onSubmit = async (data) => {
//     const cleanData = cleanPayload(data);

//     const action = isEdit ? updateEmployee : createEmployee;

//     const payload = isEdit ? { data: cleanData, productId: id } : cleanData;

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const result = await action(payload).unwrap();

//       if (result.success) {
//         toast.success(
//           result.message ||
//             (isEdit
//               ? "Employee updated successfully"
//               : "Employee added successfully")
//         );

//         if (!isEdit) reset();

//         navigate("/employees");
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Something went wrong!");
//     }
//   };

//   return (
//     <>
//       <CustomHeader
//         title="Employees"
//         subtitle="Add a new worker to your workforce"
//       />

//       {currentEmployeeLoading ? (
//         <CircularLoading />
//       ) : (
//         <CardWrapper>
//           <Form key={id || "new"} {...methods}>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <RHFInput
//                 name="name"
//                 label="Employee's full name *"
//                 placeholder="Enter full name"
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* TODO - DEFAULT VALUE IS NOT SETTING WHILE EDIT MODE */}
//                 <RHFSelect
//                   name="gender"
//                   label="Gender *"
//                   placeholder="Select gender"
//                   options={GENDER_OPTIONS}
//                 />

//                 <RHFInput
//                   name="email"
//                   label="Email (optional)"
//                   placeholder="Enter employee's email address"
//                 />

//                 <RHFInput
//                   name="phone"
//                   label="Contact No. *"
//                   type="tel"
//                   placeholder="Enter employee's phone"
//                 />

//                 <RHFInput
//                   name="emergencyContact"
//                   label="Emergency Contact No. *"
//                   type="tel"
//                   placeholder="Enter employee's emergency phone"
//                 />

//                 {/* TODO - DEFAULT VALUE IS NOT SETTING WHILE EDIT MODE */}
//                 <RHFSelect
//                   name="position"
//                   label="Position *"
//                   placeholder="Select position"
//                   options={EMPLOYEES_POSITION_OPTIONS}
//                 />

//                 <RHFDatePicker
//                   name="joiningDate"
//                   label="Joining date (DD-MM-YYYY) *"
//                 />

//                 <RHFInput
//                   name="monthlySalary"
//                   label="Monthly salary *"
//                   type="number"
//                   placeholder="Enter monthly salary"
//                   disabled={isEdit}
//                 />

//                 <RHFDatePicker
//                   name="dateOfBirth"
//                   label="Date of birth (DD-MM-YYYY) *"
//                 />
//               </div>

//               <RHFInput
//                 name="nidNumber"
//                 label="NID/Birth Registration No. *"
//                 placeholder="Enter NID/Birth registration number"
//               />

//               <RHFInput
//                 name="presentAddress"
//                 label="Present address *"
//                 placeholder="Enter full address"
//               />

//               <RHFInput
//                 name="permanentAddress"
//                 label="Permanent address *"
//                 placeholder="Enter full address"
//               />

//               <div className="flex justify-end gap-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate("/employees")}
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="submit"
//                   className="custom-button"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting
//                     ? "Submitting..."
//                     : isEdit
//                     ? "Update"
//                     : "Create Employee"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardWrapper>
//       )}
//     </>
//   );
// }
