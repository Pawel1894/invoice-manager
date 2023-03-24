import Image from "next/image";
import React, { useState } from "react";
import Checkbox from "./Checkbox";

export default function Filter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-x-3 font-bold text-neutral-500 dark:text-white"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <span>
          Filter <span className="hidden md:inline">by status</span>
        </span>
        <Image
          className={`${isOpen ? "rotate-180" : ""} transition-all`}
          src={"/assets/icon-arrow-down.svg"}
          alt="Open statuses list"
          width={12}
          height={12}
        />
      </button>
      <ul
        className={`${
          isOpen ? "block" : "hidden"
        } absolute left-1/2 top-8 w-48 -translate-x-1/2 rounded-lg bg-white p-4 shadow-md dark:bg-neutral-200`}
      >
        <li>
          <Checkbox
            text="Paid"
            onChange={(e) => {
              console.log(e);
            }}
          />
        </li>
        <li className="mt-3">
          <Checkbox
            text="Pending"
            onChange={(e) => {
              console.log(e);
            }}
          />
        </li>
        <li className="mt-3">
          <Checkbox
            text="Paid"
            onChange={(e) => {
              console.log(e);
            }}
          />
        </li>
      </ul>
    </div>
  );
}
