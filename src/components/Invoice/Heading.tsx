import React from "react";
import { statusStyle } from "../Invoice";
import type { Invoice, Status } from "@prisma/client";
import Button from "../Button";
import Image from "next/image";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  status?: Status;
  invoiceId: string;
};

export default function Heading({ status, invoiceId }: Props) {
  const queryClient = useQueryClient();
  const utils = api.useContext();

  const { mutate: setStatus } = api.invoice.setStatus.useMutation({
    onMutate: async ({ id, status }) => {
      const key = [["invoice", "get"], { input: id, type: "query" }];
      const invoiceData: Invoice | undefined = await queryClient.getQueryData(
        key
      );

      if (invoiceData) {
        queryClient.setQueryData(key, () => {
          return { ...invoiceData, status: status };
        });
      }

      return { invoiceData, key: key };
    },
    onError: (err, input, context) => {
      if (context?.invoiceData)
        queryClient.setQueryData(context?.key, context?.invoiceData);
    },
    onSettled: async () => {
      await utils.invoice.get.invalidate();
    },
  });

  function updateStatus() {
    if (status === "DRAFT") {
      setStatus({
        id: invoiceId,
        status: "PENDING",
      });
    } else if (status === "PENDING") {
      setStatus({
        id: invoiceId,
        status: "PAID",
      });
    } else {
      setStatus({
        id: invoiceId,
        status: "DRAFT",
      });
    }
  }

  return (
    <div className="flex rounded-lg bg-white p-6 shadow-light dark:bg-neutral-100 lg:justify-between">
      <div className="flex w-full items-center  gap-5 dark:text-white lg:w-auto">
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
      <div className=" items-center lg:flex lg:gap-2">
        <Button className="hidden lg:block" stylemode="default">
          Edit
        </Button>
        <Button
          className="hidden lg:block"
          stylemode="default"
          onClick={updateStatus}
        >
          {status === "PAID"
            ? "Mark as Draft"
            : status === "PENDING"
            ? "Mark as Paid"
            : "Mark as Pending"}
        </Button>
        <Button className="hidden lg:block" stylemode="danger">
          Delete
        </Button>
        <Button className="flex gap-1" stylemode="primary">
          <Image
            className="hidden lg:block"
            src={"/assets/icon-send.svg"}
            width={18}
            height={18}
            alt="send indicator"
          />
          <span>Send</span>
        </Button>
      </div>
    </div>
  );
}
