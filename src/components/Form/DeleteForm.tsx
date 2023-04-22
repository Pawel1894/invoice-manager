import React from "react";
import Button from "../Button";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import LoadIndicator from "../LoadIndicator";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceId: string;
  number: string;
};

export default function DeleteForm({ setIsOpen, invoiceId, number }: Props) {
  const router = useRouter();
  const { mutate: deleteInvoice, isLoading } = api.invoice.delete.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      void router.push("/invoice");
    },
  });
  return (
    <div className="absolute  top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-accent-800">
      <div className="mx-4 h-56  rounded-lg bg-white  p-9 dark:bg-neutral-700">
        {isLoading ? (
          <LoadIndicator />
        ) : (
          <>
            <span className="block text-3xl font-bold text-neutral-500 dark:text-neutral-600">
              Confirm Deletion
            </span>
            <p className="mt-2 w-[30ch] text-neutral-400">
              Are you sure you want to delete invoice #{number}? This action
              cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-x-2">
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button
                stylemode="danger"
                onClick={() => {
                  deleteInvoice(invoiceId);
                }}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
