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
import { DateUtil } from "@utils";
import { format } from "date-fns";
import { CalendarSearch } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface InputDateProps {
  date?: Date | undefined;
  onChange?: (date?: Date) => Date;
}

const InputDate = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [inputValue, setInputValue] = useState(
    format(new Date(), "dd/MM/yyyy")
  );
  const hasError = !date;

  const handleInputChange = useCallback((value: string) => {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 8);

    setInputValue(
      clean.length === 8
        ? `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`
        : clean
    );

    const parsed = DateUtil.parseInputDDMMYYYY(clean);

    setDate(parsed);
  }, []);
  const calendarMonth = useMemo(() => {
    if (!date) return new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }, [date]);

  useEffect(() => {
    if (date) {
      setInputValue(DateUtil.formatDate(date));
    }
  }, [date]);
  return (
    <Tooltip open={hasError}>
      <TooltipTrigger>
        <InputGroup className={hasError ? "border-destructive border" : ""}>
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
                onMonthChange={(month: Date) => {
                  if (date) {
                    const newDate = new Date(
                      month.getFullYear(),
                      month.getMonth(),
                      date.getDate()
                    );
                    setDate(newDate);
                  }
                }}
                selected={date}
                onSelect={(selected: Date | undefined) => {
                  if (selected) setDate(selected);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroup>
      </TooltipTrigger>
      <TooltipContent>day/month/year</TooltipContent>
    </Tooltip>
  );
};

export { InputDate };
