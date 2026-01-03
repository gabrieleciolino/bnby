import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NumberFieldProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> & {
  value: number | string | undefined;
  onChange: (...event: unknown[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  inputClassName?: string;
};

const clampValue = (value: number, min?: number, max?: number) => {
  let next = value;
  if (typeof min === "number") {
    next = Math.max(min, next);
  }
  if (typeof max === "number") {
    next = Math.min(max, next);
  }
  return next;
};

const resolveValue = (value: unknown, min?: number) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return typeof min === "number" ? min : 0;
};

function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
  inputClassName,
  disabled,
  ...props
}: NumberFieldProps) {
  const currentValue = clampValue(resolveValue(value, min), min, max);

  const updateValue = (nextValue: number) => {
    onChange(clampValue(nextValue, min, max));
  };

  const isAtMin = typeof min === "number" ? currentValue <= min : false;
  const isAtMax = typeof max === "number" ? currentValue >= max : false;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => updateValue(currentValue - step)}
        aria-label="Diminuisci valore"
        disabled={disabled || isAtMin}
      >
        -
      </Button>
      <Input
        {...props}
        type="number"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            updateValue(typeof min === "number" ? min : 0);
            return;
          }
          const nextValue = Number(raw);
          if (!Number.isNaN(nextValue)) {
            updateValue(nextValue);
          }
        }}
        className={cn("w-16 text-center tabular-nums hidden", inputClassName)}
        disabled={disabled}
      />
      <span className="w-8 text-center tabular-nums text-lg font-medium">
        {currentValue}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => updateValue(currentValue + step)}
        aria-label="Aumenta valore"
        disabled={disabled || isAtMax}
      >
        +
      </Button>
    </div>
  );
}

export { NumberField };
