import { useFormContext, Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function RHFTextArea({ name, label, placeholder, rows = 10 }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              className="min-h-[168px]"
            />
          </FormControl>
          {errors[name] && <FormMessage>{errors[name]?.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
}
