import * as Yup from "yup";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { RHFInput, RHFSelect } from "@/components/form";

import { useGetAllProductQuery } from "@/redux/features/product/productApi";
import { useGetAllCustomerQuery } from "@/redux/features/customer/customerApi";
import { useCreateInvoiceMutation } from "@/redux/features/invoice/invoiceApi";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

const ProductSchema = Yup.object().shape({
  customerId: Yup.string().trim().required("Customer is required"),

  phone: Yup.string()
    .trim()
    .notRequired()
    .matches(
      /^$|^01[0-9]{9}$/,
      "Phone number must be a valid 11-digit Bangladeshi number",
    )
    .required("Phone is required"),

  address: Yup.string().trim().required("Address is required"),
});

export default function InvoiceForm() {
  const navigate = useNavigate();

  const currentUser = useSelector(useCurrentUser);

  const currentUserId = currentUser?.user?.userId;

  const { id } = useParams();

  const isEdit = Boolean(id);

  const [items, setItems] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");

  const [quantity, setQuantity] = useState("");

  const [paidAmount, setPaidAmount] = useState("");

  // CUSTOMERS
  const { data: customerData, isSuccess } = useGetAllCustomerQuery();

  // PRODUCTS
  const { data: productData } = useGetAllProductQuery();

  // INVOICE
  const [createInvoice, { _isLoading }] = useCreateInvoiceMutation();

  const customerOptions = useMemo(() => {
    if (!isSuccess || !Array.isArray(customerData?.data)) return [];
    return customerData.data.map((customer) => ({
      value: customer._id,
      label: customer.name,
      phone: customer.phone,
      address: customer.address,
    }));
  }, [customerData, isSuccess]);

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues: {
      customerId: "",
      phone: "",
      address: "",
    },
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const selectedCustomerId = watch("customerId");

  useEffect(() => {
    const selectedCustomer = customerOptions.find(
      (c) => c.value === selectedCustomerId,
    );
    if (selectedCustomer) {
      setValue("phone", selectedCustomer.phone || "");
      setValue("address", selectedCustomer.address || "");
    }
  }, [selectedCustomerId, customerOptions, setValue]);

  // const addItem = () => {
  //   if (!selectedProduct || !quantity) {
  //     toast.error("Please select a product and quantity");
  //     return;
  //   }

  //   const product = productData?.data?.find((p) => p._id === selectedProduct);
  //   console.log("product: ", product);

  //   if (!product) return;

  //   const quantityWithoutReserved = parseInt(product.stock - product.reserved);

  //   if (parseInt(quantity) > quantityWithoutReserved) {
  //     toast.error(`Quantity exceeds available stock`);
  //     return;
  //   }

  //   const newItem = {
  //     id: Date.now(),
  //     productId: product.id,
  //     name: product.name,
  //     sku: product.sku,
  //     price: product.price,
  //     quantity: parseInt(quantity),
  //     total: product.price * parseInt(quantity),
  //   };

  //   setItems([...items, newItem]);
  //   setSelectedProduct("");
  //   setQuantity("");
  // };

  const addItem = () => {
    if (!selectedProduct || !quantity) {
      toast.error("Please select a product and quantity");
      return;
    }

    const product = productData?.data?.find((p) => p._id === selectedProduct);
    if (!product) return;

    const requestedQty = parseInt(quantity);
    const quantityWithoutReserved = parseInt(product.stock - product.reserved);

    // Find if this product already exists in the items list
    const existingItem = items.find((item) => item.productId === product._id);
    const alreadyAddedQty = existingItem ? existingItem.quantity : 0;

    // Total quantity after adding this time
    const totalRequested = alreadyAddedQty + requestedQty;

    if (totalRequested > quantityWithoutReserved) {
      const availableToAdd = quantityWithoutReserved - alreadyAddedQty;

      toast.error(
        availableToAdd <= 0
          ? `You’ve already added the maximum available quantity for "${product.name}".`
          : `Only ${availableToAdd} more item(s) available for "${product.name}".`,
      );
      return;
    }

    if (existingItem) {
      // Update quantity and total for existing product
      const updatedItems = items.map((item) =>
        item.productId === product._id
          ? {
              ...item,
              quantity: item.quantity + requestedQty,
              total: (item.quantity + requestedQty) * product.price,
            }
          : item,
      );
      setItems(updatedItems);
    } else {
      // Add as a new item
      const newItem = {
        id: Date.now(),
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: requestedQty,
        total: product.price * requestedQty,
      };
      setItems([...items, newItem]);
    }

    // Reset input fields
    setSelectedProduct("");
    setQuantity("");
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal;
  const due = total - (paidAmount || 0);

  const onSubmit = async (formData) => {
    if (items.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (paidAmount > total) {
      toast.error("Paid amount can't be more then total amount");
      return;
    }

    const payload = {
      customerId: formData.customerId,
      totalAmount: subtotal,
      paidAmount: parseFloat(paidAmount) || 0,
      dueAmount: due,
      issuedBy: currentUserId,
      products: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await createInvoice(payload).unwrap();

      // console.log("result: ", result);

      if (result.success) {
        toast.success(
          result.message ||
            (isEdit
              ? "Invoice updated successfully"
              : "Invoice added successfully"),
        );

        setItems([]);

        setPaidAmount("");

        reset();

        navigate("/invoice-details", {
          state: { currentInvoice: result?.data },
        });
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="shadow-lg">
        {/* Invoice Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Invoice</h1>

              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-2">Alishan</h2>
              <p className="text-sm text-gray-500">Painadi Shiddhirganj</p>
              <p className="text-sm text-gray-500">Narayanganj</p>
              <p className="text-xs text-gray-500">01636428996</p>
            </div>
          </div>

          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Details */}
              <RHFSelect
                name="customerId"
                label="Select customer *"
                placeholder="Select customer"
                options={customerOptions?.map(({ value, label }) => ({
                  value,
                  label,
                }))}
              />

              <div className="grid grid-cols-2 gap-4 mb-6">
                <RHFInput
                  name="phone"
                  label="Phone *"
                  type="tel"
                  disabled
                  placeholder="Customers phone"
                />

                <RHFInput
                  name="address"
                  label="Address *"
                  type="text"
                  disabled
                  placeholder="Address"
                />
              </div>

              {/* Add Item Form */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <Label className="mb-2">Product</Label>
                  <Select
                    value={selectedProduct}
                    onValueChange={setSelectedProduct}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {productData?.data?.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name} - ${product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2">Quantity</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setQuantity(value);
                      }
                    }}
                    placeholder="Enter quantity"
                    min="1"
                    step="1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addItem}
                    disabled={!selectedCustomerId}
                    className="bg-[#B38A2D] hover:bg-[#E1BE5D] w-full"
                  >
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="p-6">
                <div className="w-full overflow-x-auto">
                  <table className="min-w-[700px] w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">SKU</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Total</th>
                        <th className="text-right py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2">{item.sku}</td>
                          <td className="text-right py-2">${item.price}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">${item.total}</td>
                          <td className="text-right py-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mt-5">
                  <div className="w-72">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mb-2 font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="mb-2">
                      <Label className="mb-2">Paid Amount</Label>
                      <Input
                        type="number"
                        value={paidAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setPaidAmount(value);
                          }
                        }}
                        placeholder="Enter paid amount"
                        min="1"
                      />
                    </div>

                    <div className="flex justify-between font-bold text-red-500">
                      <span>Due:</span>
                      <span>${due.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => navigate("/invoices")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="custom-button"
                  disabled={
                    !selectedCustomerId || !items?.length || isSubmitting
                  }
                >
                  {isSubmitting ? "Submitting..." : "Create Invoice"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
