"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface CalendarProps extends Omit<React.ComponentProps<typeof ReactDatePicker>, "onChange" | "selected"> {
  selected?: Date | null
  onChange?: (date: Date | null) => void
}

function Calendar({ className, selected, onChange, ...props }: CalendarProps) {
  return (
    <div className={cn("p-3", className)}>
      <ReactDatePicker
        selected={selected ?? null}
        onChange={onChange}
        inline
        calendarClassName="[&_.react-datepicker__navigation]:opacity-50 [&_.react-datepicker__navigation:hover]:opacity-100"
        renderCustomHeader={({ decreaseMonth, increaseMonth, monthDate }) => (
          <div className="flex justify-center pt-1 relative items-center">
            <button
              type="button"
              onClick={decreaseMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium">
              {monthDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
            </div>
            <button
              type="button"
              onClick={increaseMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
