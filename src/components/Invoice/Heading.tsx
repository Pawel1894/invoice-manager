import React from "react";
import { statusStyle } from "../Invoice";
import type { Status } from "@prisma/client";
import Button from "../Button";

type Props = {
  status?: Status;
};

export default function Heading({ status }: Props) {
  return (
    <div className="flex rounded-lg bg-white p-6 shadow-light dark:bg-neutral-100 lg:justify-between">
      <div className="flex w-full items-center justify-between dark:text-white lg:w-auto lg:justify-start lg:gap-5">
        <span>Status</span>
        <div
          className={`rounded-md ${
            status ? statusStyle[status].bg : statusStyle["DRAFT"].bg
          } flex w-[6.5rem] items-center justify-center px-[1rem] py-2`}
        >
          <span
            className={`mr-2 inline-block h-2 w-2 rounded-full  ${
              status ? statusStyle[status].accent : statusStyle["DRAFT"].accent
            }`}
          ></span>
          <span
            className={`capitalize  ${
              status ? statusStyle[status].text : statusStyle["DRAFT"].text
            }`}
          >
            {status?.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="hidden items-center lg:flex lg:gap-2">
        <Button stylemode="default">Edit</Button>
        <Button stylemode="danger">Delete</Button>
        <Button stylemode="primary">Mark as Paid</Button>
      </div>
    </div>
  );
}
