import { ErrorMessage, Form, Formik, type FormikProps } from "formik";
import React, { useRef, useState } from "react";
import Button from "../Button";
import CustomInput from "./CustomInput";
import CustomDatePicker from "./CustomDatePicker";
import FormikCustomDropdown from "./FormikCustomDropdown";
import ItemsInput from "./ItemsInput";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import ClientAutocomplete from "./ClientAutocomplete";
import LoadIndicator from "../LoadIndicator";
import type { Invoice, InvoiceItem } from "@prisma/client";
import { type FormValues, valSchema } from "./InvoiceInsert";
import dayjs from "dayjs";

export default function InvoiceEdit({
  setIsEditOpen,
  initData,
}: {
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initData: Invoice & {
    items: InvoiceItem[];
  };
}) {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const utils = api.useContext();

  const [serverErrors, setServerErrors] = useState<Array<{
    name: string;
    value: string | undefined;
  }> | null>(null);

  const { mutate: update } = api.invoice.update.useMutation({
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
                  : "",
              },
            ];
          });
        });
      } else {
        toast.error(error.message);
      }
    },
    onSuccess: async () => {
      setIsEditOpen(false);
      await utils.invoice.get.invalidate();
      toast.success("Updated");
    },
  });

  return (
    <>
      <div className="h-[calc(100vh-228px)] overflow-x-hidden overflow-y-scroll pb-24 lg:h-[calc(100vh-140px)]">
        <h1 className=" ml-6 mb-5 block text-2xl font-bold text-neutral-500 dark:text-white lg:ml-0 lg:mb-11 lg:text-3xl">
          Edit #{initData.number}
        </h1>
        <Formik
          innerRef={formRef}
          validationSchema={valSchema}
          initialValues={{
            currency: "US",
            city: initData.city,
            name: initData.name,
            idNo: initData.idNo,
            clientId: initData.clientId,
            clientCity: initData.clientCity,
            clientCountry: initData.clientCountry,
            clientEmail: initData.clientEmail,
            clientName: initData.clientName,
            clientPostCode: initData.clientPostCode,
            clientStreetAddress: initData.clientStreetAddress,
            country: initData.country,
            postCode: initData.postCode,
            projectDescription: initData.decription,
            streetAddress: initData.streetAddress,
            invoiceNum: initData.number,
            bankAccount: initData.bankAccount,
            items: [...initData.items],
            invoiceDate: initData.invoiceDate,
            paymentTerms: dayjs(initData.dueDate).diff(
              initData.invoiceDate,
              "days"
            ),
          }}
          onSubmit={(value, otp) => {
            update({
              id: initData.id,
              InvoiceSchema: {
                ...value,
                status: initData.status,
              },
            });
          }}
        >
          <Form data-testid="insert-form">
            {false ? (
              <div className="flex justify-center">
                <LoadIndicator />
              </div>
            ) : (
              <>
                <div className="px-6">
                  <span className="mb-6 block text-primary-100">Bill From</span>
                  <CustomInput label="Name" name="name" id="name" />
                  <CustomInput
                    label="Identification No."
                    name="idNo"
                    id="idNo"
                    styles="mt-6"
                    placeholder="eg. EIN 0123456789"
                  />
                  <CustomInput
                    label="Street Address"
                    name="streetAddress"
                    type="text"
                    id="fromStreetAddress"
                    styles="mt-6"
                  />
                  <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
                    <CustomInput
                      label="City"
                      name="city"
                      type="text"
                      id="city"
                    />
                    <CustomInput
                      label="Post Code"
                      name="postCode"
                      type="text"
                      id="fromPostCode"
                    />
                    <CustomInput
                      styles="col-span-full lg:col-span-1"
                      label="Country"
                      name="country"
                      type="text"
                      id="fromCountry"
                    />
                  </div>
                  <CustomInput
                    label="Bank Account"
                    name="bankAccount"
                    id="bankAccount"
                    styles="mt-6"
                  />
                  <span className="mb-6 mt-12 block text-primary-100">
                    Bill To
                  </span>
                  <ClientAutocomplete
                    label="Client's Name"
                    name="clientName"
                    id="clientName"
                  />
                  <CustomInput
                    label="Client's Email"
                    name="clientEmail"
                    type="email"
                    id="clientEmail"
                    styles="mt-6"
                  />
                  <CustomInput
                    label="Client's Identification No."
                    name="clientId"
                    type="text"
                    id="clientId"
                    styles="mt-6"
                    placeholder="eg. EIN 0123456789"
                  />
                  <CustomInput
                    label="Street Address"
                    name="clientStreetAddress"
                    type="text"
                    id="clientStreetAddress"
                    styles="mt-6"
                  />
                  <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
                    <CustomInput
                      label="City"
                      name="clientCity"
                      type="text"
                      id="clientCity"
                    />
                    <CustomInput
                      label="Post Code"
                      name="clientPostCode"
                      type="text"
                      id="clientPostCode"
                    />
                    <CustomInput
                      label="Country"
                      name="clientCountry"
                      type="text"
                      id="clientCountry"
                      styles="col-span-full lg:col-span-1"
                    />
                  </div>
                  <div className="mt-16 flex flex-col gap-6 lg:flex-row">
                    <CustomDatePicker
                      label="Invoice Date"
                      name="invoiceDate"
                      id="invoiceDate"
                      styles="w-full"
                    />
                    <FormikCustomDropdown
                      label="Payment Terms"
                      options={[
                        {
                          label: "Net 1 ",
                          value: 1,
                        },
                        {
                          label: "Net 7 ",
                          value: 7,
                        },
                        {
                          label: "Net 14",
                          value: 14,
                        },
                        {
                          label: "Net 30",
                          value: 30,
                        },
                      ]}
                      name="paymentTerms"
                      id="paymentTerms"
                    />
                  </div>
                  <CustomInput
                    label="Invoice Number"
                    name="invoiceNum"
                    id="invoiceNum"
                    styles="mt-6"
                  />

                  <CustomInput
                    label="Project Description"
                    name="projectDescription"
                    id="projectDescription"
                    placeholder="e.g. Graphic Design Service"
                    styles="my-6"
                  />
                  <FormikCustomDropdown
                    label="Currency"
                    options={[
                      {
                        label: "USD",
                        value: "US",
                      },
                      {
                        label: "PLN",
                        value: "PL",
                      },
                      {
                        label: "GBP",
                        value: "GB",
                      },
                      {
                        label: "EUR",
                        value: "DE",
                      },
                    ]}
                    name="currency"
                    id="currency"
                  />
                  <div className="mt-16">
                    <ItemsInput id="items" name="items" label="Item List" />
                  </div>
                </div>
                <div ref={errorSummaryRef} className="mt-6 flex flex-col gap-2">
                  <ErrorMessage
                    name="name"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#name"
                        >
                          name {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="idNo"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#idNo"
                        >
                          Identification No. {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="streetAddress"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#fromStreetAddress"
                        >
                          Street Address {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="city"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#city"
                        >
                          City {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="postCode"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#postCode"
                        >
                          Post Code {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="country"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#country"
                        >
                          Country {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="clientName"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#clientName"
                        >
                          Client Name {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="clientEmail"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#clientEmail"
                        >
                          Client Email {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="clientStreetAddress"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#clientStreetAddress"
                        >
                          Client Street Address {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="clientCity"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#clientCity"
                        >
                          Client City {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="clientPostCode"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#clientPostCode"
                        >
                          Client Post Code {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="clientCountry"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#clientCountry"
                        >
                          Client Country {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="invoiceDate"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#invoiceDate"
                        >
                          Invoice Date {e}
                        </a>
                      );
                    }}
                  />
                  <ErrorMessage
                    name="paymentTerms"
                    render={(e) => {
                      return (
                        <a
                          className="text-sm text-accent-100 underline"
                          href="#paymentTerms"
                        >
                          Payment Terms {e}
                        </a>
                      );
                    }}
                  />
                  {serverErrors &&
                    serverErrors?.length > 0 &&
                    serverErrors.map((i) => (
                      <a
                        key={i.name}
                        className="text-sm text-accent-100 underline"
                        href={`#${i.name ?? ""}`}
                      >
                        {`${i.name ?? ""} ${i.value ?? ""}`}
                      </a>
                    ))}
                </div>
              </>
            )}
          </Form>
        </Formik>
      </div>

      <div className="flex items-center justify-center gap-x-2 bg-white py-[1.375rem] shadow-upper dark:bg-transparent dark:shadow-none lg:justify-end lg:bg-transparent lg:px-6 lg:shadow-none">
        <Button
          type="button"
          onClick={() => {
            setIsEditOpen(false);
            formRef.current?.resetForm();
          }}
        >
          Discard
        </Button>
        <Button
          type="submit"
          stylemode="primary"
          onClick={() => {
            formRef.current?.handleSubmit();
          }}
        >
          Save Changes
        </Button>
      </div>
    </>
  );
}
