import Image from "next/image";
import React from "react";

export default function Filter() {
  return (
    <div>
      <button className="flex items-center gap-x-3 font-bold text-neutral-500">
        <span>
          Filter <span className="hidden md:inline">by status</span>
        </span>
        <Image
          src={"/assets/icon-arrow-down.svg"}
          alt="Open statuses list"
          width={12}
          height={12}
        />
      </button>
      <ul className="hidden">
        <li>Paid</li>
        <li>Pending</li>
        <li>Draft</li>
      </ul>
    </div>
  );
}
