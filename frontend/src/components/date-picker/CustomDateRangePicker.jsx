import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format, isAfter, isSameDay, parse, isValid } from "date-fns";

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
        ? parse(date, "yyyy-MM-dd", new Date())
        : date instanceof Date
          ? date
          : undefined;
    return isValid(d) ? d : undefined;
  };

  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "";
    return format(date, "yyyy-MM-dd");
  };

  const formatDateForDisplay = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "";
    return format(date, "dd-MM-yyyy");
  };

  // Track the actual committed range
  const [committedRange, setCommittedRange] = useState({
    from: parseDate(fromDate),
    to: parseDate(toDate),
  });

  // Track what's shown in calendar (for visual feedback during selection)
  const [calendarRange, setCalendarRange] = useState({
    from: parseDate(fromDate),
    to: parseDate(toDate),
  });

  // Sync with props when they change externally
  useEffect(() => {
    const parsedFrom = parseDate(fromDate);
    const parsedTo = parseDate(toDate);
    setCommittedRange({ from: parsedFrom, to: parsedTo });
    setCalendarRange({ from: parsedFrom, to: parsedTo });
  }, [fromDate, toDate]);

  const handleSelect = (range) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (!range || !range.from) {
      setCommittedRange({ from: undefined, to: undefined });
      setCalendarRange({ from: undefined, to: undefined });
      onChange?.({ from: "", to: "" });
      return;
    }

    const { from, to } = range;

    // Check if this is the library quirk (both dates same on first click)
    if (from && to && isSameDay(from, to)) {
      // Block future dates
      if (isAfter(from, today)) {
        return;
      }

      // This is actually a first click, so only set from date
      setCalendarRange({ from, to: undefined });
      setCommittedRange({ from, to: undefined });

      return;
    }

    // Block future dates
    if (from && isAfter(from, today)) {
      return;
    }
    if (to && isAfter(to, today)) {
      return;
    }

    // Always update calendar visual
    setCalendarRange({ from, to });

    // Only commit when we have a proper range (two different dates)
    if (from && to && !isSameDay(from, to)) {
      // Normalize: ensure from is before to
      let normalizedFrom = from;
      let normalizedTo = to;

      if (isAfter(normalizedFrom, normalizedTo)) {
        normalizedFrom = to;
        normalizedTo = from;
      }

      const finalRange = { from: normalizedFrom, to: normalizedTo };
      setCommittedRange(finalRange);
      setCalendarRange(finalRange);

      const apiRange = {
        from: formatDateForAPI(normalizedFrom),
        to: formatDateForAPI(normalizedTo),
      };

      onChange?.(apiRange);

      // Close popover on complete selection
      setTimeout(() => open.onFalse(), 100);
    } else if (from && !to) {
      // Only start date
      setCommittedRange({ from, to: undefined });
    }
  };

  const handleClear = () => {
    setCommittedRange({ from: undefined, to: undefined });
    setCalendarRange({ from: undefined, to: undefined });
    onChange?.({ from: "", to: "" });
  };

  // When opening popover, sync calendar with committed range
  const handleOpenChange = (isOpen) => {
    open.onToggle(isOpen);
    if (isOpen) {
      setCalendarRange(committedRange);
    }
  };

  return (
    <div className={cn("w-full flex gap-2", className)}>
      <Popover open={open.value} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date-range"
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !committedRange.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {committedRange.from ? (
              committedRange.to ? (
                <>
                  {formatDateForDisplay(committedRange.from)} -{" "}
                  {formatDateForDisplay(committedRange.to)}
                </>
              ) : (
                <>
                  {formatDateForDisplay(committedRange.from)} - Select end date
                </>
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={calendarRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => {
              const today = new Date();
              today.setHours(23, 59, 59, 999);
              return isAfter(date, today);
            }}
          />
        </PopoverContent>
      </Popover>

      {(committedRange.from || committedRange.to) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="shrink-0"
          aria-label="Clear date selection"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
