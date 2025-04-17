
import * as React from "react";
import { TooltipProvider as RadixTooltipProvider } from "@/components/ui/tooltip";

interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <RadixTooltipProvider>{children}</RadixTooltipProvider>;
}
