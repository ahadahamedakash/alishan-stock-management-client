import { useFormContext, Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function RHFSelect({
  name,
  label,
  options = [],
  disabled = false,
  placeholder = "Select an option",
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              key={field.value}
              value={field.value}
              // onValueChange={field.onChange}
              onValueChange={(val) => {
                if (!disabled) field.onChange(val);
              }}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                {/* <SelectValue placeholder={placeholder} /> */}
                <SelectValue
                  placeholder={placeholder}
                  defaultValue={field.value}
                />
              </SelectTrigger>
              <SelectContent className="w-full">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {errors[name] && <FormMessage>{errors[name]?.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}
