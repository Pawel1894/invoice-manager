import Image from "next/image";
import React, { useState } from "react";
import Checkbox from "./Checkbox";
import type { ActiveFilter } from "~/pages/invoice";

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<ActiveFilter>>;
  filters: ActiveFilter;
};

export default function Filter({ setFilters, filters }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const anyActive = filters.Draft || filters.Paid || filters.Pending;

  return (
    <div className="relative">
      <button
        className="flex items-center gap-x-3 font-bold text-neutral-500 dark:text-white"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <span className={anyActive ? "text-primary-100" : ""}>
          {anyActive
            ? `(${Object.values(filters).reduce(
                (sum, item) => sum + (item === true ? 1 : 0),
                0
              )})`
            : ""}{" "}
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
            text="Draft"
            onChange={(e) => {
              const value = e.target.checked;
              setFilters((prevState) => {
                return {
                  ...prevState,
                  Draft: value,
                };
              });
            }}
          />
        </li>
        <li className="mt-3">
          <Checkbox
            text="Pending"
            onChange={(e) => {
              const value = e.target.checked;
              setFilters((prevState) => {
                return {
                  ...prevState,
                  Pending: value,
                };
              });
            }}
          />
        </li>
        <li className="mt-3">
          <Checkbox
            text="Paid"
            onChange={(e) => {
              const value = e.target.checked;
              setFilters((prevState) => {
                return {
                  ...prevState,
                  Paid: value,
                };
              });
            }}
          />
        </li>
      </ul>
    </div>
  );
}
