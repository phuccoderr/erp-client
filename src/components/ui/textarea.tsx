import * as React from "react";

import { cn } from "@lib";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./field";

interface TextareaProps<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<"textarea">,
  "name"
> {
  isForm?: boolean;
  name?: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: string;
}

function Textarea<TFieldValues extends FieldValues>({
  isForm = false,
  name,
  control,
  label,
  required = false,
  id,
  className,
  ...props
}: TextareaProps<TFieldValues>) {
  const basedClassName =
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 text-xs";

  if (isForm && name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel htmlFor={id || name}>
                {label}
                {required && (
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </FieldLabel>
            )}
            <textarea
              {...field}
              data-slot="input"
              className={cn(basedClassName, className)}
              id={id || name}
              aria-invalid={fieldState.invalid}
              {...props}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }

  return (
    <textarea
      data-slot="textarea"
      className={cn(basedClassName, className)}
      {...props}
    />
  );
}

export { Textarea };
