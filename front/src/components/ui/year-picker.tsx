"use client";

import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface YearPickerProps {
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
  /** Minimum allowed year */
  fromYear?: number;
  /** Maximum allowed year */
  toYear?: number;
}

function YearPicker({
  value,
  onChange,
  disabled,
  placeholder = "Select year",
  className,
  format: dateFormat = "yyyy",
  fromYear = -1000,
  toYear = 2100,
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [focusedYear, setFocusedYear] = useState<number | null>(null);

  // Initialize with current date if no value provided
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();

  // Calculate the current decade
  const [viewDecade, setViewDecade] = useState(() => {
    const year = value ? value.getFullYear() : currentYear;
    return Math.floor(year / 10) * 10;
  });

  // Generate years for the current decade view
  const years = useMemo(() => {
    // Create an array of years for the current decade
    const decadeYears = [];

    // Add the last year from previous decade
    if (viewDecade > fromYear) {
      decadeYears.push(viewDecade - 1);
    }

    // Add the current decade years
    for (
      let year = viewDecade;
      year < viewDecade + 10 && year <= toYear;
      year++
    ) {
      if (year >= fromYear) {
        decadeYears.push(year);
      }
    }

    // Add the first year from next decade
    if (viewDecade + 10 <= toYear) {
      decadeYears.push(viewDecade + 10);
    }

    return decadeYears;
  }, [viewDecade, fromYear, toYear]);

  // Reset view when value changes
  useEffect(() => {
    if (value) {
      const year = value.getFullYear();
      setViewDecade(Math.floor(year / 10) * 10);
    }
  }, [value]);

  // Reset when opened
  useEffect(() => {
    if (open) {
      const year = value ? value.getFullYear() : currentYear;
      setViewDecade(Math.floor(year / 10) * 10);
      setInputValue("");
      setInputError(false);
      // Set initial focus to current/selected year
      setFocusedYear(value ? value.getFullYear() : currentYear);
    }
  }, [open, value, currentYear]);

  const handleSelectYear = useCallback(
    (year: number) => {
      // Preserve the month from the existing value or use January
      const month = value ? value.getMonth() : 0;
      const day = value
        ? Math.min(value.getDate(), new Date(year, month + 1, 0).getDate())
        : 1;

      const newDate = new Date(year, month, day);
      onChange?.(newDate);
      setOpen(false);
    },
    [value, onChange]
  );

  const handlePrevDecade = useCallback(() => {
    setViewDecade((prev) => Math.max(fromYear, prev - 10));
  }, [fromYear]);

  const handleNextDecade = useCallback(() => {
    setViewDecade((prev) => Math.min(toYear - 9, prev + 10));
  }, [toYear]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(false);
  }, []);

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        console.log("Enter");
        console.log(inputValue);
        const parsedYear = Number.parseInt(inputValue, 10);
        if (
          !isNaN(parsedYear) &&
          parsedYear >= fromYear &&
          parsedYear <= toYear
        ) {
          setViewDecade(Math.floor(parsedYear / 10) * 10);
          setFocusedYear(parsedYear);
          handleSelectYear(parsedYear);
        } else {
          setInputError(true);
        }
        e.preventDefault();
      }
    },
    [inputValue, fromYear, toYear, handleSelectYear]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (focusedYear === null || !years.includes(focusedYear)) return;

      const yearIndex = years.indexOf(focusedYear);
      const cols = 4;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (yearIndex % cols === 0) {
            // If at the left edge, go to previous decade
            if (viewDecade > fromYear) {
              handlePrevDecade();
              // Focus on the right edge of the new decade
              setFocusedYear(Math.max(focusedYear - 1, fromYear));
            }
          } else {
            setFocusedYear(years[yearIndex - 1]);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (yearIndex % cols === cols - 1 || yearIndex === years.length - 1) {
            // If at the right edge, go to next decade
            if (viewDecade + 10 <= toYear) {
              handleNextDecade();
              // Focus on the left edge of the new decade
              setFocusedYear(Math.min(focusedYear + 1, toYear));
            }
          } else if (yearIndex < years.length - 1) {
            setFocusedYear(years[yearIndex + 1]);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (yearIndex < cols) {
            // If at the top edge, go to previous decade
            if (viewDecade > fromYear) {
              handlePrevDecade();
              // Focus on the bottom of the new decade
              setFocusedYear(Math.max(focusedYear - cols, fromYear));
            }
          } else {
            setFocusedYear(years[yearIndex - cols]);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (yearIndex >= years.length - cols) {
            // If at the bottom edge, go to next decade
            if (viewDecade + 10 <= toYear) {
              handleNextDecade();
              // Focus on the top of the new decade
              setFocusedYear(Math.min(focusedYear + cols, toYear));
            }
          } else if (yearIndex + cols < years.length) {
            setFocusedYear(years[yearIndex + cols]);
          }
          break;
        case "Enter":
          e.preventDefault();
          handleSelectYear(
            inputValue ? Number.parseInt(inputValue, 10) : focusedYear
          );
          break;
        case "Home":
          e.preventDefault();
          setFocusedYear(years[0]);
          break;
        case "End":
          e.preventDefault();
          setFocusedYear(years[years.length - 1]);
          break;
        case "PageUp":
          e.preventDefault();
          handlePrevDecade();
          break;
        case "PageDown":
          e.preventDefault();
          handleNextDecade();
          break;
      }
    },
    [
      focusedYear,
      years,
      fromYear,
      toYear,
      viewDecade,
      handlePrevDecade,
      handleNextDecade,
      handleSelectYear,
      inputValue,
    ]
  );

  // Focus the button when focusedYear changes
  const buttonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  useEffect(() => {
    if (open && focusedYear !== null && buttonRefs.current.has(focusedYear)) {
      buttonRefs.current.get(focusedYear)?.focus();
    }
  }, [open, focusedYear]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-60 max-w-full overflow-hidden justify-start text-left font-normal",
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
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handlePrevDecade}
              disabled={viewDecade <= fromYear}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Previous Decade</span>
            </Button>
            <div className="relative flex-1">
              <div
                className="text-center font-medium text-sm"
                aria-live="polite"
              >
                {viewDecade} - {Math.min(viewDecade + 9, toYear)}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextDecade}
              disabled={viewDecade + 10 > toYear}
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">Next Decade</span>
            </Button>
          </div>

          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className={cn(
                "h-7 text-center",
                inputError &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              placeholder={`Type a year (${fromYear}-${toYear})`}
              type="number"
              min={fromYear}
              max={toYear}
            />
          </div>

          <div
            className="grid grid-cols-4 gap-2"
            role="listbox"
            aria-label="Year selection"
          >
            {years.map((year) => {
              const isSelected = value?.getFullYear() === year;
              const isCurrent = currentYear === year;
              const isOutsideDecade =
                year < viewDecade || year >= viewDecade + 10;

              return (
                <Button
                  ref={(el) => {
                    buttonRefs.current.set(year, el);
                  }}
                  key={year}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-9 p-0 px-1.5 font-normal",
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    !isSelected && isCurrent && "border-primary",
                    isOutsideDecade && "text-muted-foreground opacity-50"
                  )}
                  onClick={() => handleSelectYear(year)}
                  onFocus={() => setFocusedYear(year)}
                  role="option"
                  aria-selected={isSelected}
                >
                  {year}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
YearPicker.displayName = "YearPicker";

export { YearPicker };
