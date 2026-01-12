import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@lib";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldLabel } from "./field";
import { Typography } from "./typography";

interface CheckboxProps<TFieldValues extends FieldValues>
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  isForm?: boolean;
  name?: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: string;
}

function Checkbox<TFieldValues extends FieldValues>({
  isForm = false,
  name,
  control,
  label,
  className,
  ...props
}: CheckboxProps<TFieldValues>) {
  const basedCheckBox = (fieldProps?: any) => (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      checked={fieldProps ? fieldProps.value : props.checked}
      onCheckedChange={fieldProps ? fieldProps.onChange : props.onCheckedChange}
      onBlur={fieldProps ? fieldProps.onBlur : props.onBlur}
      disabled={fieldProps ? fieldProps.disabled : props.disabled}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (isForm && name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            {basedCheckBox(field)}
            <FieldLabel>{label}</FieldLabel>
          </Field>
        )}
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      {basedCheckBox(props)}
      {label && <Typography variant="muted">{label}</Typography>}
    </div>
  );
}

export { Checkbox };
