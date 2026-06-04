"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { format, setMonth, setYear } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MonthPickerProps {
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
  /** Show year navigation */
  showYearNavigation?: boolean;
  /** Format string for the displayed date */
  format?: string;
  /** Minimum allowed year */
  fromYear?: number;
  /** Maximum allowed year */
  toYear?: number;
}

function MonthPicker({
  value,
  onChange,
  disabled,
  placeholder = "Select month",
  className,
  showYearNavigation = true,
  format: dateFormat = "MMMM yyyy",
  fromYear = 1900,
  toYear = 2100,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [focusedMonth, setFocusedMonth] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);

  // Initialize with current date if no value provided
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() =>
    value ? new Date(value) : new Date()
  );

  const months = useMemo(
    () => [
      { value: 0, label: "Jan", name: "January" },
      { value: 1, label: "Feb", name: "February" },
      { value: 2, label: "Mar", name: "March" },
      { value: 3, label: "Apr", name: "April" },
      { value: 4, label: "May", name: "May" },
      { value: 5, label: "Jun", name: "June" },
      { value: 6, label: "Jul", name: "July" },
      { value: 7, label: "Aug", name: "August" },
      { value: 8, label: "Sep", name: "September" },
      { value: 9, label: "Oct", name: "October" },
      { value: 10, label: "Nov", name: "November" },
      { value: 11, label: "Dec", name: "December" },
    ],
    []
  );

  // Reset view date when value changes
  useEffect(() => {
    if (value) {
      setViewDate(new Date(value));
    }
  }, [value]);

  // Reset view date when opened
  useEffect(() => {
    if (open) {
      setViewDate(value ? new Date(value) : new Date());
      setInputValue("");
      setInputError(false);
      // Set initial focus to current/selected month
      setFocusedMonth(value ? value.getMonth() : today.getMonth());
    }
  }, [open, value, today]);

  const handleSelectMonth = useCallback(
    (month: number) => {
      const newDate = setMonth(viewDate, month);
      onChange?.(newDate);
      setOpen(false);
    },
    [viewDate, onChange]
  );

  const handlePrevYear = useCallback(() => {
    if (viewDate.getFullYear() > fromYear) {
      setViewDate((prev) => setYear(prev, prev.getFullYear() - 1));
    }
  }, [viewDate, fromYear]);

  const handleNextYear = useCallback(() => {
    if (viewDate.getFullYear() < toYear) {
      setViewDate((prev) => setYear(prev, prev.getFullYear() + 1));
    }
  }, [viewDate, toYear]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(false);
  }, []);

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const parsedYear = Number.parseInt(inputValue, 10);
        if (
          !isNaN(parsedYear) &&
          parsedYear >= fromYear &&
          parsedYear <= toYear
        ) {
          setViewDate((prev) => {
            const newDate = new Date(prev);
            newDate.setFullYear(parsedYear);
            onChange?.(newDate);
            return newDate;
          });
          setInputError(false);
          setInputValue("");
        } else {
          setInputError(true);
        }
        e.preventDefault();
      }
    },
    [inputValue, fromYear, toYear, onChange]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (focusedMonth === null) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setFocusedMonth((prev) =>
            prev === null || prev === 0 ? 11 : prev - 1
          );
          break;
        case "ArrowRight":
          e.preventDefault();
          setFocusedMonth((prev) =>
            prev === null || prev === 11 ? 0 : prev + 1
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedMonth((prev) => {
            if (prev === null) return 8;
            return prev < 4 ? prev + 8 : prev - 4;
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedMonth((prev) => {
            if (prev === null) return 3;
            return prev > 7 ? prev - 8 : prev + 4;
          });
          break;
        case "Enter":
          e.preventDefault();
          if (focusedMonth !== null) {
            handleSelectMonth(focusedMonth);
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusedMonth(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedMonth(11);
          break;
        case "PageUp":
          e.preventDefault();
          handlePrevYear();
          break;
        case "PageDown":
          e.preventDefault();
          handleNextYear();
          break;
      }
    },
    [focusedMonth, handleSelectMonth, handlePrevYear, handleNextYear]
  );

  // Focus the button when focusedMonth changes
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>(Array(12).fill(null));

  useEffect(() => {
    if (open && focusedMonth !== null && buttonRefs.current[focusedMonth]) {
      buttonRefs.current[focusedMonth]?.focus();
    }
  }, [open, focusedMonth]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          {value ? format(value, dateFormat) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onKeyDown={handleKeyDown}
      >
        <div className="p-3 space-y-3 flex flex-col items-center">
          {showYearNavigation && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  viewDate.getFullYear() <= fromYear &&
                    "opacity-50 cursor-not-allowed"
                )}
                disabled={viewDate.getFullYear() <= fromYear}
                onClick={handlePrevYear}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous Year</span>
              </Button>

              <div className="relative max-w-30">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  className={cn(
                    "h-7 text-center",
                    inputError &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder={viewDate.getFullYear().toString()}
                  type="text"
                  // hide arrow controllers
                  inputMode="numeric"
                  min={fromYear}
                  max={toYear}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  viewDate.getFullYear() >= toYear &&
                    "opacity-50 cursor-not-allowed"
                )}
                disabled={viewDate.getFullYear() >= toYear}
                onClick={handleNextYear}
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next Year</span>
              </Button>
            </div>
          )}
          <div
            className="grid grid-cols-4 gap-2"
            role="listbox"
            aria-label="Month selection"
          >
            {months.map((month, index) => {
              const isSelected =
                value?.getMonth() === month.value &&
                value?.getFullYear() === viewDate.getFullYear();
              const isCurrent =
                today.getMonth() === month.value &&
                today.getFullYear() === viewDate.getFullYear();

              return (
                <Button
                  ref={(el) => void (buttonRefs.current[index] = el)}
                  key={month.value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-9 p-0 px-1.5 w-full justify-center font-normal",
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    !isSelected && isCurrent && "border-primary"
                  )}
                  onClick={() => handleSelectMonth(month.value)}
                  onFocus={() => setFocusedMonth(month.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="sr-only">{month.name}</span>
                  <span aria-hidden="true">{month.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
MonthPicker.displayName = "MonthPicker";

export { MonthPicker };
