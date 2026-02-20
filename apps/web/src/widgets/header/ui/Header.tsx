import React from "react";
import Navbar from "@/src/widgets/navbar/ui/Navbar";

export async function Header() {
  return (
    <header className="bg-transparent shadow-md top-0 z-50 border-b-[1px] border-b-neutral-800">
      <Navbar />
    </header>
  );
}
