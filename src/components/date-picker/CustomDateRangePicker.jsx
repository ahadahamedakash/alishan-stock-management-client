import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, isAfter, isBefore, isSameDay, parse, isValid } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useBoolean } from "@/hooks";

export default function CustomDateRangePicker({
  fromDate,
  toDate,
  onChange,
  className,
}) {
  const open = useBoolean();

  const parseDate = (date) => {
    if (!date) return undefined;
    const d =
      typeof date === "string"
        ? parse(date, "dd-MM-yyyy", new Date())
        : date instanceof Date
        ? date
        : undefined;
    return isValid(d) ? d : undefined;
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return undefined;
    return format(date, "dd-MM-yyyy");
  };

  const [dateRange, setDateRange] = useState({
    from: parseDate(fromDate),
    to: parseDate(toDate),
  });

  useEffect(() => {
    setDateRange({
      from: parseDate(fromDate),
      to: parseDate(toDate),
    });
  }, [fromDate, toDate]);

  const handleSelect = (range) => {
    if (!range) return;

    const today = new Date();
    let from = range.from;
    let to = range.to;

    // Prevent future date selection
    from =
      from && (isBefore(from, today) || isSameDay(from, today))
        ? from
        : undefined;
    to = to && (isBefore(to, today) || isSameDay(to, today)) ? to : undefined;

    // Reset `to` if `from > to`
    if (from && to && isAfter(from, to)) {
      setDateRange({ from, to: undefined });
      onChange?.({
        from: formatDate(from),
        to: undefined,
      });
    } else {
      setDateRange({ from, to });
      onChange?.({
        from: formatDate(from),
        to: formatDate(to),
      });
    }

    // Close popover only when both dates are valid
    if (from && to) {
      open.onFalse();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open.value} onOpenChange={open.onToggle}>
        <PopoverTrigger asChild>
          <Button
            id="date-range"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                </>
              ) : (
                formatDate(dateRange.from)
              )
            ) : (
              <span>Select a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => isAfter(date, new Date())}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// import { cn } from "@/lib/utils";
// import { useEffect, useState } from "react";
// import { CalendarIcon } from "lucide-react";
// import { format, isAfter, isBefore, isSameDay } from "date-fns";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";

// import { useBoolean } from "@/hooks";

// export default function CustomDateRangePicker({
//   fromDate,
//   toDate,
//   onChange,
//   className,
// }) {
//   console.log(fromDate);
//   console.log(toDate);
//   const open = useBoolean();

//   const parseDate = (date) =>
//     typeof date === "string" ? new Date(date) : date;

//   const [dateRange, setDateRange] = useState({
//     from: parseDate(fromDate) || undefined,
//     to: parseDate(toDate) || undefined,
//   });

//   console.log("dateRange", dateRange);

//   const formatDate = (date) => (date ? format(date, "dd-MM-yyyy") : undefined);

//   const handleSelect = (range) => {
//     if (!range) return;
//     const { from, to } = range;

//     const today = new Date();
//     const validTo =
//       to && (isBefore(to, today) || isSameDay(to, today)) ? to : undefined;
//     const validFrom =
//       from && (isBefore(from, today) || isSameDay(from, today))
//         ? from
//         : undefined;

//     if (validFrom && validTo && isAfter(validFrom, validTo)) {
//       setDateRange({ from: validFrom, to: undefined });
//       onChange?.({ from: formatDate(validFrom), to: undefined });
//     } else {
//       setDateRange({ from: validFrom, to: validTo });
//       onChange?.({
//         from: formatDate(validFrom),
//         to: formatDate(validTo),
//       });
//     }

//     if (validFrom && validTo) {
//       open.onFalse();
//     }
//   };

//   return (
//     <div className={cn("w-full", className)}>
//       <Popover open={open.value} onOpenChange={open.onToggle}>
//         <PopoverTrigger asChild>
//           <Button
//             id="date-range"
//             variant="outline"
//             className={cn(
//               "w-full justify-start text-left font-normal",
//               !dateRange.from && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {dateRange.from ? (
//               dateRange.to ? (
//                 <>
//                   {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
//                 </>
//               ) : (
//                 formatDate(dateRange.from)
//               )
//             ) : (
//               <span>Select a date range</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             selected={dateRange}
//             onSelect={handleSelect}
//             numberOfMonths={2}
//             disabled={(date) => isAfter(date, new Date())}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
