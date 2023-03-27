import type { Invoice as Props, Status } from "@prisma/client";
import Image from "next/image";
import React from "react";
import dayjs from "dayjs";
import { format } from "number-to-local-currency";
import Link from "next/link";

const statusStyle: {
  [key in Status]: { bg: string; text: string; accent: string };
} = {
  DRAFT: {
    bg: "bg-neutral-600 dark:bg-neutral-200",
    accent: "bg-neutral-400 dark:bg-neutral-300",
    text: "text-neutral-400 dark:text-neutral-300",
  },
  PAID: {
    bg: "bg-accent-800",
    accent: "bg-accent-700",
    text: "text-accent-700",
  },
  PENDING: {
    bg: "bg-accent-600",
    accent: "bg-accent-500",
    text: "text-accent-500",
  },
};

export default function Invoice({
  id,
  number,
  dueDate,
  clientName,
  totalAmount,
  status,
}: Props) {
  return (
    <Link
      href={`/invoice/${id}`}
      className="grid w-full  grid-cols-2 gap-y-2 rounded-lg bg-white p-6 shadow-light dark:bg-neutral-100"
    >
      <span className="row-start-1 mb-5 justify-self-start font-bold  dark:text-white">
        <span className="text-accent-300 ">#</span>
        {number}
      </span>
      <span className="col-span-1 row-start-2 justify-self-start text-sm text-accent-300">
        Due {dayjs(dueDate).format("DD MMM YYYY")}
      </span>
      <span className="col-span-2 row-start-1 justify-self-end text-right text-sm text-accent-300 dark:text-white">
        {clientName}
      </span>
      <span
        title={format(totalAmount, "en-GB")}
        className="col-start-1 row-start-3 w-full justify-self-start overflow-hidden text-ellipsis whitespace-nowrap text-left dark:text-white"
      >
        {format(totalAmount, "en-GB")}
      </span>
      <div className="row-span-2 flex items-center justify-self-end">
        <div
          className={`rounded-md ${statusStyle[status].bg}  py-2 px-[1.6875rem] `}
        >
          <span
            className={`mr-2 inline-block h-2 w-2 rounded-full  ${statusStyle[status].accent}`}
          ></span>
          <span className={`capitalize  ${statusStyle[status].text}`}>
            {status.toLowerCase()}
          </span>
        </div>
      </div>
      <Image
        className="hidden"
        src={"/assets/icon-arrow-right.svg"}
        width={12}
        height={12}
        alt=""
        aria-hidden={true}
      />
    </Link>
  );
}
