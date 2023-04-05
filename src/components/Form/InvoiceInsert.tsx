import { ErrorMessage, Form, Formik, type FormikProps } from "formik";
import React, { useRef, useState } from "react";
import Button from "../Button";
import CustomInput from "./CustomInput";
import CustomDatePicker from "./CustomDatePicker";
import FormikCustomDropdown from "./FormikCustomDropdown";
import ItemsInput from "./ItemsInput";
import * as Yup from "yup";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import ClientAutocomplete from "./ClientAutocomplete";

type FormValues = {
  streetAddress: string;
  city: string;
  postCode: string;
  country: string;
  clientName: string;
  clientEmail: string;
  clientStreetAddress: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;
  invoiceDate: Date;
  paymentTerms: number;
  projectDescription: string;
  invoiceNum: string;
  bankAccount: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
};

const valSchema = Yup.object({
  streetAddress: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  city: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  postCode: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  country: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  clientName: Yup.string().max(40, "too long!").required("can't be empty"),
  clientStreetAddress: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  clientCity: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  clientPostCode: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  invoiceNum: Yup.string().required("can't be empty"),
  clientCountry: Yup.string()
    .min(1, "too short!")
    .max(40, "too long!")
    .required("can't be empty"),
  invoiceDate: Yup.date().required("can't be empty"),
  clientEmail: Yup.string().email("must be a valid email"),
  projectDescription: Yup.string(),
  paymentTerms: Yup.number().min(1).required("can't be empty"),
  items: Yup.array(
    Yup.object({
      name: Yup.string()
        .min(1, "too short!")
        .max(40, "too long!")
        .required("can't be empty"),
      quantity: Yup.number()
        .positive("can't be negative")
        .required("must be a number"),
      price: Yup.number().required("must be a number"),
      total: Yup.number(),
    })
  ),
});

export default function InvoiceInsert() {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const { refetch: refetchInit } = api.invoice.lastUserData.useQuery(
    undefined,
    {
      onSettled: (data) => {
        if (formRef.current) {
          formRef.current.resetForm();
          formRef.current.initialValues.streetAddress =
            data?.streetAddress ?? "";
          formRef.current.initialValues.bankAccount = data?.bankAccount ?? "";
          formRef.current.initialValues.city = data?.city ?? "";
          formRef.current.initialValues.country = data?.country ?? "";
          formRef.current.initialValues.postCode = data?.postCode ?? "";
        }
      },
    }
  );

  const [serverErrors, setServerErrors] = useState<Array<{
    name: string;
    value: string | undefined;
  }> | null>(null);
  const [submitAction, setSubmitAction] = useState<"DRAFT" | "PENDING">(
    "DRAFT"
  );
  const ctx = api.useContext();

  const { mutate: createInvoice, isLoading } = api.invoice.create.useMutation({
    onSuccess: () => {
      void ctx.invoice.getInvoices.invalidate();
      formRef.current?.resetForm();
      toast.success("Invoice created!");
    },
    onError: (error) => {
      if (error.data?.zodError && error.data?.zodError.fieldErrors) {
        Object.keys(error.data?.zodError.fieldErrors).forEach((item) => {
          setServerErrors((prevState) => {
            if (!prevState)
              return [
                {
                  name: item,
                  value: error.data?.zodError?.fieldErrors[item]
                    ? error.data?.zodError?.fieldErrors[item][0]
                    : "",
                },
              ];

            return [
              ...prevState,
              {
                name: item,
                value: error.data?.zodError?.fieldErrors[item]
                  ? error.data?.zodError?.fieldErrors[item][0]
                  : "",
              },
            ];
          });
        });
      } else {
        toast.error(error.message);
      }
    },
    onSettled: async () => {
      await refetchInit();
    },
  });

  function handleSubmit(type: "DRAFT" | "PENDING") {
    setServerErrors(null);
    if (formRef) {
      setSubmitAction(type);
      formRef.current?.handleSubmit();
    }
  }

  return (
    <>
      <div className="h-[calc(100vh-228px)] overflow-x-hidden overflow-y-scroll pb-24 lg:h-[calc(100vh-140px)]">
        <h1 className=" ml-6 mb-5 block text-2xl font-bold text-neutral-500 dark:text-white lg:ml-0 lg:mb-11 lg:text-3xl">
          New Invoice
        </h1>
        <Formik
          innerRef={formRef}
          validationSchema={valSchema}
          initialValues={{
            city: "",
            clientCity: "",
            clientCountry: "",
            clientEmail: "",
            clientName: "",
            clientPostCode: "",
            clientStreetAddress: "",
            country: "",
            postCode: "",
            projectDescription: "",
            streetAddress: "",
            invoiceNum: "",
            bankAccount: "",
            items: [
              {
                name: "",
                quantity: 1,
                price: 0,
                total: 0,
              },
            ],
            invoiceDate: new Date(),
            paymentTerms: 1,
          }}
          onSubmit={(value) => {
            const requestData = {
              ...value,
              status: submitAction,
            };

            createInvoice(requestData);
          }}
        >
          <Form>
            {isLoading ? (
              <span>LOADING</span>
            ) : (
              <>
                <div className="px-6">
                  <span className="mb-6 block text-primary-100">Bill From</span>
                  <CustomInput
                    label="Street Address"
                    name="streetAddress"
                    type="text"
                    id="fromStreetAddress"
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
                  {/* <CustomInput
                    label="Client's Name"
                    name="clientName"
                    type="text"
                    id="clientName"
                  /> */}
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
                  <div className="mt-12 flex flex-col gap-6 lg:flex-row">
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
                    styles="mt-6"
                  />
                  <div className="mt-16">
                    <ItemsInput id="items" name="items" label="Item List" />
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
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
        <Button stylemode="default" className="lg:mr-auto">
          Discard
        </Button>
        <Button stylemode="accent" onClick={() => handleSubmit("DRAFT")}>
          Save as Draft
        </Button>
        <Button stylemode="primary" onClick={() => handleSubmit("PENDING")}>
          Save & Send
        </Button>
      </div>
    </>
  );
}
