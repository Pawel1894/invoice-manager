import Image from "next/image";
import React from "react";

export default function ThemeToggler() {
  return (
    <button title="change color theme">
      <Image
        src={"/assets/icon-moon.svg"}
        alt="Change theme to dark mode"
        width={20}
        height={20}
      />
    </button>
  );
}
