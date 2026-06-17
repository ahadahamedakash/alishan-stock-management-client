import { useMemo, useState } from "react";
import { format, isAfter } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import useBoolean from "@/hooks/use-boolean";

// --------------------------------------------------
// Custom month/year dropdown UI
function CustomCaption({ displayMonth, goToMonth }) {
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i).toLocaleString("default", { month: "long" })
      ),
    []
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  }, []);

  const [selectedYear, setSelectedYear] = useState(displayMonth.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(displayMonth.getMonth());

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    goToMonth(new Date(year, selectedMonth));
  };

  const handleMonthChange = (e) => {
    const month = Number(e.target.value);
    setSelectedMonth(month);
    goToMonth(new Date(selectedYear, month));
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b bg-muted">
      <div className="flex items-center gap-2">
        <select
          className="text-sm rounded-md border px-2 py-1 bg-background text-foreground"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          className="text-sm rounded-md border px-2 py-1 bg-background text-foreground"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month, i) => (
            <option key={month} value={i}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// --------------------------------------------------
// RHFDatePicker main component
export default function RHFDatePicker({
  name,
  label,
  placeholder = "Pick a date",
  disabled = false,
  disableSelection = false,
  defaultToToday = false,
  lockToToday = false,
  restrictFuture = false,
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { value: isOpen, onTrue, onFalse } = useBoolean(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const parsedDate = field.value
          ? new Date(field.value.split("-").reverse().join("-"))
          : defaultToToday || lockToToday
          ? new Date()
          : undefined;

        const isLocked = disabled || lockToToday;

        return (
          <FormItem className="flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover
                open={isOpen}
                onOpenChange={(v) => (v ? onTrue() : onFalse())}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={isLocked}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ?? <span>{placeholder}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parsedDate}
                    onSelect={(date) => {
                      if (date && !disableSelection && !isLocked) {
                        // Restrict future dates
                        if (restrictFuture && isAfter(date, new Date())) return;

                        const formatted = format(date, "dd-MM-yyyy");
                        field.onChange(formatted);
                        onFalse();
                      }
                    }}
                    initialFocus
                    components={{ Caption: CustomCaption }}
                    // Disable future dates if restrictFuture is true
                    disabled={(date) =>
                      disableSelection ||
                      isLocked ||
                      (restrictFuture && isAfter(date, new Date()))
                    }
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {errors[name] && <FormMessage>{errors[name]?.message}</FormMessage>}
          </FormItem>
        );
      }}
    />
  );
}

{
  /* <RHFDatePicker
  name="birthDate"
  label="Date of Birth"
  placeholder="Select your birth date"
  restrictFuture={true}
/> */
}

{
  /* <RHFDatePicker
  name="deliveryDate"
  label="Delivery Date"
  defaultToToday={true}
  lockToToday={true}
/> */
}
