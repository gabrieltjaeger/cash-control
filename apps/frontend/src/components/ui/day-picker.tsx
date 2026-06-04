"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DayPickerProps {
  /** The currently selected date */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date?: Date) => void;
  /** Disable the input */
  disabled?: boolean;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Additional classes for the trigger button */
  className?: string;
  /** Format string for the displayed date */
  format?: string;
  /** Minimum allowed date */
  fromDate?: Date;
  /** Maximum allowed date */
  toDate?: Date;
  /** Whether the popover is open */
  open?: boolean;
  /** Callback when the popover open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Initial focus when opened */
  initialFocus?: boolean;
}

function DayPicker({
  value,
  onChange,
  disabled,
  placeholder = "Pick a date",
  className,
  format: dateFormat = "PPP",
  fromDate,
  toDate,
  open,
  onOpenChange,
  initialFocus = true,
}: DayPickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Handle date selection
  const handleSelectDay = useCallback(
    (date?: Date | null) => {
      onChange?.(date || undefined);
      setIsOpen(false);
    },
    [onChange, setIsOpen]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-60 max-w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelectDay}
          initialFocus={initialFocus}
          disabled={(date) => {
            if (fromDate && date < fromDate) return true;
            if (toDate && date > toDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

DayPicker.displayName = "DayPicker";

export { DayPicker };
