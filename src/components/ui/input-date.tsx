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
import { LANG_KEY_CONST } from "@constants";
import { DateUtil } from "@utils";
import { format } from "date-fns";
import { CalendarSearch } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface InputDateProps {
  date?: Date | undefined;
  onChange?: (date?: Date | undefined) => void;
}

const InputDate = ({ date, onChange }: InputDateProps) => {
  const [stateDate, setStateDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (date) {
      setStateDate(date);
    }
  }, [date]);

  useEffect(() => {
    if (stateDate) {
      setInputValue(DateUtil.formatDate(stateDate));
    }
  }, [stateDate]);

  const [inputValue, setInputValue] = useState(
    format(new Date(), "dd/MM/yyyy")
  );
  const hasError = !stateDate;

  const handleInputChange = useCallback(
    (value: string) => {
      const clean = value.replace(/[^0-9]/g, "").slice(0, 8);

      setInputValue(
        clean.length === 8
          ? `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`
          : clean
      );

      const parsed = DateUtil.parseInputDDMMYYYY(clean);

      setStateDate(parsed);

      onChange?.(parsed);
    },
    [onChange]
  );

  const handleCalendarSelect = (selected: Date | undefined) => {
    setStateDate(selected);
    onChange?.(selected);
  };

  const handleMonthChange = (month: Date) => {
    if (stateDate) {
      const newDate = new Date(
        month.getFullYear(),
        month.getMonth(),
        stateDate.getDate()
      );
      setStateDate(newDate);
      onChange?.(newDate);
    }
  };

  const calendarMonth = useMemo(() => {
    if (!stateDate) return new Date();
    return new Date(stateDate.getFullYear(), stateDate.getMonth(), 1);
  }, [stateDate]);

  return (
    <Tooltip open={hasError}>
      <TooltipTrigger>
        <InputGroup
          className={`w-36 ${hasError && "border-destructive border"}`}
        >
          <InputGroupInput
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
          />
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
                mode="single"
                captionLayout="dropdown"
                month={calendarMonth}
                onMonthChange={handleMonthChange}
                selected={stateDate}
                onSelect={handleCalendarSelect}
              />
            </PopoverContent>
          </Popover>
        </InputGroup>
      </TooltipTrigger>
      <TooltipContent>
        <Typography>{LANG_KEY_CONST.TOOLTIP_INPUT_DATE}</Typography>
      </TooltipContent>
    </Tooltip>
  );
};

export { InputDate };
