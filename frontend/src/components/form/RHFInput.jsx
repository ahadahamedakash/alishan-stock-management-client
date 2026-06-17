import { useFormContext, Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RHFInput({
  name,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  "aria-describedby": ariaDescribedby,
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [ariaDescribedby, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel htmlFor={name}>
              {label}
              {required && <span aria-label="required" className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon
                  className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={describedBy}
                aria-required={required}
                className={`${Icon ? "pl-10" : ""} ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </FormControl>
          {error && (
            <FormMessage id={errorId} role="alert" aria-live="polite">
              {error?.message}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
