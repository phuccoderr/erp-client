import * as React from "react";
import { cn } from "@lib";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./field";

interface InputProps<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<"input">,
  "name"
> {
  isForm?: boolean;
  name?: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: string;
}

function Input<TFieldValues extends FieldValues>({
  isForm = false,
  name,
  control,
  label,
  required = false,
  id,
  className,
  type,
  ...props
}: InputProps<TFieldValues>) {
  const basedClassName =
    "file:text-foreground text-xs placeholder:text-muted-foreground placeholder:text-xs selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50" +
    " focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" +
    " aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" +
    " h-8";

  if (isForm && name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel htmlFor={id || name}>
                {label}{" "}
                {required && (
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </FieldLabel>
            )}

            <input
              {...field}
              type={type}
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
    <input
      type={type}
      data-slot="input"
      className={cn(basedClassName, className)}
      {...props}
    />
  );
}

export { Input };
