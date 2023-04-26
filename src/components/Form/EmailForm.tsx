import { Form, Formik, type FormikProps } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import CustomInput from "./CustomInput";
import { type Invoice } from "@prisma/client";
import CustomTextEditor from "./CustomTextEditor";
import Button from "../Button";
import { api } from "~/utils/api";
import { Id, toast } from "react-toastify";
import LoadIndicator from "../LoadIndicator";
import Image from "next/image";

type Props = {
  setIsEmailPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInsertOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  initData: Invoice;
  isDetails?: boolean;
};

const valSchema = Yup.object({
  recipient: Yup.string().email().required("can't be empty"),
  emailMessage: Yup.string().max(2500, "too long!"),
});

type emailForm = Yup.InferType<typeof valSchema>;

export default function EmailForm({
  setIsEmailPopupOpen,
  initData,
  setIsInsertOpen,
  isDetails,
}: Props) {
  const toastId = React.useRef<Id>();
  const emailFormRef = useRef<FormikProps<emailForm>>(null);
  const utils = api.useContext();
  const [serverErrors, setServerErrors] = useState<Array<{
    name: string;
    value: string | undefined;
  }> | null>(null);

  const { mutate: previewInvoice } = api.invoice.getPdfDoc.useMutation({
    onMutate: () => {
      toastId.current = toast("Generating pdf in progress, please wait..", {
        closeButton: true,
        type: toast.TYPE.INFO,
      });
    },
    onSuccess: (data) => {
      toast.dismiss(toastId.current);

      const a = document.createElement("a");
      a.href = data;
      a.download = `${initData.name} ${initData.number}.pdf`;
      a.target = "_blank";
      a.click();
    },
    onError: (error) => {
      toast.update(toastId.current!, {
        render: error.message,
        type: toast.TYPE.ERROR,
        autoClose: 2000,
        closeButton: true,
      });
    },
  });

  const { mutate: sendInvoice, status: sendingStatus } =
    api.invoice.sendInvoice.useMutation({
      onError: (error) => {
        if (error.data?.zodError && error.data?.zodError.fieldErrors) {
          Object.keys(error.data?.zodError.fieldErrors).forEach((item) => {
            setServerErrors((prevState) => {
              if (!prevState)
                return [
                  {
                    name: item,
                    value: error.data?.zodError?.fieldErrors[item]
                      ? error.data?.zodError?.fieldErrors[item]![0]
                      : "",
                  },
                ];

              return [
                ...prevState,
                {
                  name: item,
                  value: error.data?.zodError?.fieldErrors[item]
                    ? error.data?.zodError?.fieldErrors[item]![0]
                    : undefined,
                },
              ];
            });
          });
        } else {
          toast.error(error.message);
        }
      },
      onSettled: async () => {
        if (isDetails) await utils.invoice.get.invalidate();
      },
    });
  return (
    <div className="absolute  top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-accent-800">
      <div className="mx-4 min-h-[31rem] w-full rounded-lg bg-white dark:bg-neutral-700 md:w-[30rem]">
        {sendingStatus === "success" ? (
          <div className="flex min-h-[31rem] flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full border-2 border-primary-100 p-8">
                <Image
                  src={"/assets/icon-thumb.svg"}
                  alt="Success image"
                  width={100}
                  height={100}
                />
              </div>
              <p className="text-xl  text-neutral-100 dark:text-neutral-300">
                Invoice sent succesfully!
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => {
                  setIsEmailPopupOpen(false);
                  if (setIsInsertOpen) setIsInsertOpen(false);
                }}
              >
                Close
              </Button>
              {!isDetails ? (
                <Button
                  onClick={() => setIsEmailPopupOpen(false)}
                  stylemode="primary"
                >
                  New invoice
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <Formik
            innerRef={emailFormRef}
            validationSchema={valSchema}
            initialValues={{
              recipient: initData.clientEmail ?? "",
              emailMessage: `Hi, ${initData.clientName}! <br><br> I'm sending my invoice in attachments. <br><br> Best Regards, <br> ${initData.name}`,
            }}
            onSubmit={(value) => {
              console.log(value.emailMessage);
              sendInvoice({
                invoiceId: initData.id,
                message: value.emailMessage ?? "",
                recipient: value.recipient,
                userName: initData.name,
              });
            }}
          >
            <>
              <div className="relative flex items-center justify-between border-b border-b-neutral-400 p-4 dark:border-b-primary-100">
                <h3 className="text-xl dark:text-neutral-800">
                  Send {initData?.number}
                </h3>
                <div
                  onClick={() => {
                    setIsEmailPopupOpen(false);
                    if (setIsInsertOpen) setIsInsertOpen(false);
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border hover:border-primary-100 hover:text-primary-100 dark:border-neutral-800 dark:text-neutral-800 hover:dark:border-primary-100 hover:dark:text-primary-100"
                >
                  <span className="mt-1">X</span>
                </div>
              </div>
              <Form className="px-4 py-8 ">
                {sendingStatus === "loading" ? (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <LoadIndicator />
                  </div>
                ) : (
                  <>
                    <CustomInput
                      id="recipient"
                      label="Email to"
                      name="recipient"
                    />
                    <CustomTextEditor
                      id="emailMessage"
                      label="Message"
                      name="emailMessage"
                      styles="my-5"
                    />
                    <div
                      className={`flex ${
                        serverErrors ? "justify-between" : "justify-end"
                      }`}
                    >
                      <div>
                        {serverErrors && serverErrors?.length > 0 && (
                          <div>
                            {serverErrors.map((i) => (
                              <a
                                key={i.name}
                                className="block text-sm text-accent-100 underline"
                                href={`#${i.name ?? ""}`}
                              >
                                {`${i.name ?? ""} ${i.value ?? ""}`}
                              </a>
                            ))}
                            <p className="mt-3 block text-sm font-bold text-accent-100">
                              Please fix these and submit again
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          stylemode="default"
                          onClick={() =>
                            previewInvoice({ invoiceId: initData.id })
                          }
                        >
                          <div className="flex gap-2">
                            <span>Preview PDF</span>
                          </div>
                        </Button>
                        <Button type="submit" stylemode="primary">
                          <div className="flex gap-2">
                            <Image
                              src="/assets/icon-send.svg"
                              alt="sending icon"
                              width="18"
                              height="18"
                            />
                            <span>Send</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Form>
            </>
          </Formik>
        )}
      </div>
    </div>
  );
}
