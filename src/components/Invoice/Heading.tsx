import React from "react";
import { statusStyle } from "../Invoice";
import type { Invoice, Status } from "@prisma/client";
import Button from "../Button";
import Image from "next/image";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Props = {
  status?: Status;
  invoiceId: string;
  openSendPopup: () => void;
  setIsDeletePromptOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Heading({
  status,
  invoiceId,
  openSendPopup,
  setIsDeletePromptOpen,
}: Props) {
  const queryClient = useQueryClient();
  const utils = api.useContext();

  const { mutate: previewInvoice } = api.invoice.getPdfDoc.useMutation({
    onSuccess: (data) => {
      const a = document.createElement("a");
      a.href = data;
      a.download = `invoice-${invoiceId}.pdf`;
      a.target = "_blank";
      a.click();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
      toast.error(err.message);
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
    <div className="flex justify-between rounded-lg bg-white p-6 shadow-light dark:bg-neutral-100">
      <div className="flex w-full flex-col gap-2 dark:text-white lg:w-auto  lg:flex-row lg:items-center lg:gap-5">
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
      <div className="flex items-center gap-2">
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
        <Button
          className="hidden lg:block"
          stylemode="danger"
          onClick={() => setIsDeletePromptOpen(true)}
        >
          Delete
        </Button>
        <Button
          className="flex gap-1"
          stylemode="primary"
          onClick={openSendPopup}
        >
          <Image
            className="hidden lg:block"
            src={"/assets/icon-send.svg"}
            width={18}
            height={18}
            alt="send indicator"
          />
          <span>Send</span>
        </Button>
        <button
          title="download pdf"
          onClick={() => previewInvoice({ invoiceId })}
        >
          <svg
            width="35px"
            height="35px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Complete">
              <g id="download">
                <g>
                  <path
                    d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
                    fill="none"
                    className="stroke-neutral-500 dark:stroke-white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />

                  <g>
                    <polyline
                      data-name="Right"
                      fill="none"
                      id="Right-2"
                      points="7.9 12.3 12 16.3 16.1 12.3"
                      className="stroke-neutral-500 dark:stroke-white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />

                    <line
                      fill="none"
                      className="stroke-neutral-500 dark:stroke-white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="12"
                      x2="12"
                      y1="2.7"
                      y2="14.2"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
