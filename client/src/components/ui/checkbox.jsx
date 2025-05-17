import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={
      "h-5 w-5 flex items-center justify-center rounded border border-gray-400 bg-white " +
      "data-[state=checked]:bg-primary data-[state=checked]:text-white"
    }
    {...props}
  >
    <CheckboxPrimitive.Indicator>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
