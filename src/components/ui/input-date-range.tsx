import { useCallback, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Calendar,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui";
import { CalendarSearch } from "lucide-react";
import { DateUtil } from "@utils";

const InputDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });
  const [inputFrom, setInputFrom] = useState("");
  const [inputTo, setInputTo] = useState("");
  const hasError = !dateRange?.from || !dateRange.to;

  // Xử lý thay đổi input chung
  const handleInputChange = useCallback((value: string, isFrom: boolean) => {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 8);

    if (isFrom) {
      setInputFrom(
        clean.length === 8
          ? `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`
          : clean
      );
    } else {
      setInputTo(
        clean.length === 8
          ? `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`
          : clean
      );
    }

    const parsed = DateUtil.parseInputDDMMYYYY(clean);

    setDateRange((prev) => ({
      from: isFrom ? parsed : prev?.from,
      to: isFrom ? prev?.to : parsed,
    }));
  }, []);

  useEffect(() => {
    if (dateRange?.from) {
      setInputFrom(DateUtil.formatDate(dateRange.from));
    }
    if (dateRange?.to) {
      setInputTo(DateUtil.formatDate(dateRange.to));
    }
  }, [dateRange]);

  useEffect(() => {
    setInputFrom(DateUtil.formatDate(dateRange?.from));
    setInputTo(DateUtil.formatDate(dateRange?.to));
  }, []);

  return (
    <Tooltip open={hasError}>
      <TooltipTrigger>
        <InputGroup className="border-destructive border w-58">
          <InputGroup className="border-none ">
            <InputGroupInput
              value={inputFrom}
              onChange={(e) => handleInputChange(e.target.value, true)}
            />
            -
            <InputGroupInput
              value={inputTo}
              onChange={(e) => handleInputChange(e.target.value, false)}
            />
          </InputGroup>
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupAddon align="inline-end">
                <InputGroupButton className="rounded-full" size="icon-xs">
                  <CalendarSearch />
                </InputGroupButton>
              </InputGroupAddon>
            </PopoverTrigger>
            <PopoverContent
              className="bg-transparent border-0 p-0 shadow-none"
              align="end"
            >
              <Calendar
                mode="range"
                captionLayout="label"
                numberOfMonths={2}
                pagedNavigation
                fixedWeeks
                showOutsideDays
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
              />
            </PopoverContent>
          </Popover>
        </InputGroup>
      </TooltipTrigger>
      <TooltipContent>day/month/year - day/month/year</TooltipContent>
    </Tooltip>
  );
};

export { InputDateRange };
