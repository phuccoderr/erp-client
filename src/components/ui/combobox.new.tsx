import { useEffect, useState, type MouseEvent } from "react";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Field,
  FieldError,
  FieldLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from "@components/ui";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@lib";
import { Controller, type Path } from "react-hook-form";

interface ComboboxSelectProps<T> {
  options: T[];
  value?: T | null;
  labelKey?: keyof T;
  placeholder?: string;
  onChangeValue?: (t: T | null) => void;
}

function ComboboxSelect<T>({
  options = [],
  value,
  labelKey = "id" as keyof T,
  placeholder = "Select option...",
  onChangeValue,
}: ComboboxSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>();

  function handleSelected(
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) {
    if (selected) {
      event.preventDefault();
      setSelected(undefined);
      onChangeValue?.(null);
      return;
    }
  }

  useEffect(() => {
    if (value !== null) {
      setSelected(value);
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "w-full flex justify-between h-8 border rounded-sm items-center py-1 px-3 cursor-pointer hover:bg-muted",
            `${!selected && "text-muted-foreground"}`,
          )}
        >
          <Typography>
            {selected ? String(selected[labelKey]) : placeholder}
          </Typography>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="hover:bg-transparent hover:text-current"
            onClick={handleSelected}
          >
            {selected ? <X /> : <ChevronsUpDown />}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>not found...</CommandEmpty>

            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={String(option["id" as keyof T])}
                  value={String(option[labelKey])}
                  onSelect={() => {
                    onChangeValue?.(option);
                    setSelected(option);
                    setOpen(false);
                  }}
                >
                  {String(option[labelKey])}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface ComboboxFormProps<T> extends ComboboxSelectProps<T> {
  name: Path<T>;
  control: any;
  label?: string;
  required?: boolean;
  valueKey: keyof T;
}

function ComboboxSelectForm<T>({
  name,
  control,
  label,
  required = false,
  valueKey = "id" as keyof T,
  options,
  labelKey,
}: ComboboxFormProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValue =
          options.find((opt) => opt[valueKey] === field.value) ?? null;

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}
                {required && (
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-primary ml-1.5"
                    aria-hidden="true"
                  />
                )}
              </FieldLabel>
            )}

            <ComboboxSelect
              options={options}
              labelKey={labelKey}
              value={selectedValue}
              onChangeValue={(option) => {
                const newValue = option ? option[valueKey] : null;
                field.onChange(newValue);
              }}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

export { ComboboxSelect, ComboboxSelectForm };
