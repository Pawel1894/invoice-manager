import { Form, Formik, type FormikProps } from "formik";
import React, { useRef, useState } from "react";
import Button from "../Button";
import CustomInput from "./CustomInput";
import CustomDatePicker from "./CustomDatePicker";
import FormikCustomDropdown from "./FormikCustomDropdown";
import ItemsInput from "./ItemsInput";
import * as Yup from "yup";

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
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
};

const valSchema = Yup.object({
  streetAddress: Yup.string()
    .min(1, "Too short!")
    .max(40, "Too long!")
    .required(),
  city: Yup.string().min(1, "Too short!").max(40, "Too long!").required(),
  postCode: Yup.string().min(1, "Too short!").max(40, "Too long!").required(),
  country: Yup.string().min(1, "Too short!").max(40, "Too long!").required(),
  clientName: Yup.string().min(1, "Too short!").max(40, "Too long!").required(),
  clientStreetAddress: Yup.string()
    .min(1, "Too short!")
    .max(40, "Too long!")
    .required(),
  clientCity: Yup.string().min(1, "Too short!").max(40, "Too long!").required(),
  clientPostCode: Yup.string()
    .min(1, "Too short!")
    .max(40, "Too long!")
    .required(),
  clientCountry: Yup.string()
    .min(1, "Too short!")
    .max(40, "Too long!")
    .required(),
  invoiceDate: Yup.date().required(),
  clientEmail: Yup.string().email(),
  projectDescription: Yup.string(),
  paymentTerms: Yup.number().min(1).required(),
  items: Yup.array(
    Yup.object({
      name: Yup.string().min(1, "Too short!").max(40, "Too long!").required(),
      quantity: Yup.number().min(1).required(),
      price: Yup.number().min(1).required(),
    })
  ),
});

export default function InvoiceInsert() {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [submitAction, setSubmitAction] = useState<"DRAFT" | "SEND">("DRAFT");
  function handleSubmit(type: "DRAFT" | "SEND") {
    if (formRef) {
      setSubmitAction(type);
      formRef.current?.handleSubmit();
      console.log("test", formRef.current?.errors);
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
            items: [
              {
                name: "",
                quantity: 0,
                price: 0,
                total: 0,
              },
            ],
            invoiceDate: new Date(),
            paymentTerms: 1,
          }}
          onSubmit={(value) => {
            console.log("value", value);
            console.log("submitAction", submitAction);
          }}
        >
          <Form>
            <div className="px-6">
              <span className="mb-6 block text-primary-100">Bill From</span>
              <CustomInput
                label="Street Address"
                name="streetAddress"
                type="text"
                id="fromStreetAddress"
              />
              <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
                <CustomInput label="City" name="city" type="text" id="city" />
                <CustomInput
                  label="Post Code"
                  name="postCode"
                  type="text"
                  id="fromPostCode"
                />
                <CustomInput
                  styles="col-span-full lg:col-span-1"
                  label="country"
                  name="country"
                  type="text"
                  id="fromCountry"
                />
              </div>
              <span className="mb-6 mt-12 block text-primary-100">Bill To</span>
              <CustomInput
                label="Client's Name"
                name="clientName"
                type="text"
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
          </Form>
        </Formik>
      </div>
      <div className="flex items-center justify-center gap-x-2 bg-white py-[1.375rem] shadow-upper dark:bg-transparent dark:shadow-none lg:justify-end lg:bg-transparent lg:px-6 lg:shadow-none">
        <Button styleMode="default" className="lg:mr-auto">
          Discard
        </Button>
        <Button styleMode="accent" onClick={() => handleSubmit("DRAFT")}>
          Save as Draft
        </Button>
        <Button styleMode="primary" onClick={() => handleSubmit("SEND")}>
          Save & Send
        </Button>
      </div>
    </>
  );
}
