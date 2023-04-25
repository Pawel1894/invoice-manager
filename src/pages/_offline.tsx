import Image from "next/image";
import React from "react";

export default function Offline() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-200">
      <Image src="/assets/logo2.svg" width={80} height={80} alt="logo" />
      <span className="mt-4 block text-xl text-neutral-300">
        Unable to connect to the Internet
      </span>
    </div>
  );
}
