"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue"> {
  value: number[];
  onValueChange: (val: number[]) => void;
  max: number;
  min: number;
  step: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min, max, step, ...props }, ref) => (
    <div className="relative flex w-full touch-none select-none items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([parseFloat(e.target.value)])}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
);
Slider.displayName = "Slider";

export { Slider };
