import { Form, Formik } from "formik";
import React from "react";
import Button from "../Button";
import CustomInput from "./CustomInput";
import CustomDatePicker from "./CustomDatePicker";
import FormikCustomDropdown from "./FormikCustomDropdown";

export default function InvoiceInsert() {
  return (
    <>
      <div className="h-[calc(100vh-228px)] overflow-x-hidden overflow-y-scroll pb-24 lg:h-[calc(100vh-140px)]">
        <h1 className=" ml-6 mb-5 block text-2xl font-bold text-neutral-500 lg:ml-0 lg:mb-11 lg:text-3xl">
          New Invoice
        </h1>
        <Formik
          initialValues={{ firstName: "" }}
          onSubmit={(value) => {
            console.log(value);
          }}
        >
          <Form>
            <div className="px-6">
              <span className="mb-6 block text-primary-100">Bill From</span>
              <CustomInput
                label="Street Address"
                name="fromStreetAddress"
                type="text"
                id="fromStreetAddress"
              />
              <div className="mt-6 grid grid-cols-2 gap-6">
                <CustomInput
                  label="City"
                  name="city"
                  type="text"
                  id="fromCity"
                />
                <CustomInput
                  label="Post Code"
                  name="fromPostCode"
                  type="text"
                  id="fromPostCode"
                />
                <CustomInput
                  styles="col-span-full"
                  label="Country"
                  name="fromCountry"
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
              <div className="mt-6 grid grid-cols-2 gap-6">
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
                  styles="col-span-full"
                />
              </div>
              <div className="mt-6 flex flex-col gap-6">
                <CustomDatePicker
                  label="Invoice Date"
                  name="invoiceDate"
                  id="invoiceDate"
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
            </div>
          </Form>
        </Formik>
      </div>
      <div className="flex items-center justify-center gap-x-2 bg-white py-[1.375rem] shadow-upper dark:bg-neutral-100 dark:shadow-none lg:justify-end lg:bg-transparent lg:px-6 lg:shadow-none">
        <Button styleMode="default">Discard</Button>
        <Button styleMode="accent">Save as Draft</Button>
        <Button styleMode="primary">Save & Send</Button>
      </div>
    </>
  );
}
