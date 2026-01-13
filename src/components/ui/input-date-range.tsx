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
  Typography,
} from "@components/ui";
import { CalendarSearch } from "lucide-react";
import { DateUtil } from "@utils";
import { LANG_KEY_CONST } from "@constants";

interface DateRangeProps {
  dateRange?: DateRange | undefined;
  onChange?: (date?: DateRange | undefined) => void;
}

const InputDateRange = ({ dateRange, onChange }: DateRangeProps) => {
  const [stateDateRange, setStateDateRange] = useState<DateRange | undefined>(
    dateRange || undefined
  );
  useEffect(() => {
    if (dateRange) {
      setStateDateRange(dateRange);
    }
  }, [dateRange]);

  useEffect(() => {
    if (stateDateRange?.from) {
      setInputFrom(DateUtil.formatDate(stateDateRange.from));
    }
    if (stateDateRange?.to) {
      setInputTo(DateUtil.formatDate(stateDateRange.to));
    }
  }, [stateDateRange]);

  const [inputFrom, setInputFrom] = useState("");
  const [inputTo, setInputTo] = useState("");
  // const hasError = !stateDateRange?.from || !stateDateRange.to;

  useEffect(() => {
    onChange?.(stateDateRange);
  }, [stateDateRange, onChange]);

  // Xử lý thay đổi input chung
  const handleInputChange = useCallback((value: string, isFrom: boolean) => {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 8);

    const formatted =
      clean.length === 8
        ? `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`
        : clean;

    if (isFrom) {
      setInputFrom(formatted);
    } else {
      setInputTo(formatted);
    }

    const parsed = DateUtil.parseInputDDMMYYYY(clean);

    setStateDateRange((prev) => ({
      from: isFrom ? parsed : prev?.from,
      to: isFrom ? prev?.to : parsed,
    }));
  }, []);

  const handleCalendarSelect = (selected: DateRange | undefined) => {
    setStateDateRange(selected);
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <InputGroup>
          <InputGroup className="border-none w-56">
            <InputGroupInput
              placeholder="01/01/1900"
              value={inputFrom}
              onChange={(e) => handleInputChange(e.target.value, true)}
            />
            -
            <InputGroupInput
              placeholder={DateUtil.formatDate(new Date())}
              value={inputTo}
              onChange={(e) => handleInputChange(e.target.value, false)}
            />
          </InputGroup>
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs">
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
                defaultMonth={stateDateRange?.from ?? new Date()}
                selected={stateDateRange}
                onSelect={handleCalendarSelect}
              />
            </PopoverContent>
          </Popover>
        </InputGroup>
      </TooltipTrigger>
      <TooltipContent>
        <Typography>
          {LANG_KEY_CONST.COMMON_TOOLTIP_INPUT_DATE_RANGE}
        </Typography>
      </TooltipContent>
    </Tooltip>
  );
};

export { InputDateRange };
