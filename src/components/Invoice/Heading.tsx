import React from "react";
import { statusStyle } from "../Invoice";
import type { Status } from "@prisma/client";
import Button from "../Button";

type Props = {
  status: Status;
};

export default function Heading({ status }: Props) {
  return (
    <div className="flex rounded-lg bg-white p-6 shadow-light">
      <div className="flex w-full items-center justify-between">
        <span>Status</span>
        <div
          className={`rounded-md ${statusStyle[status].bg} flex w-[6.5rem] items-center justify-center px-[1rem] py-2`}
        >
          <span
            className={`mr-2 inline-block h-2 w-2 rounded-full  ${statusStyle[status].accent}`}
          ></span>
          <span className={`capitalize  ${statusStyle[status].text}`}>
            {status.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="hidden items-center lg:flex">
        <Button>Edit</Button>
        <Button>Delete</Button>
        <Button>Mark as Paid</Button>
      </div>
    </div>
  );
}
