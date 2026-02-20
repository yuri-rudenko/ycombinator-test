"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import React from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider defaultTheme={"dark"} attribute={"class"} enableSystem>
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
