import { Form, Formik, type FormikProps } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import CustomInput from "./CustomInput";
import { type Invoice } from "@prisma/client";
import CustomTextArea from "./CustomTextArea";
import Button from "../Button";

type Props = {
  setIsEmailPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initData: Invoice | undefined;
};

const valSchema = Yup.object({
  email: Yup.string().email().required("can't be empty"),
  emailMessage: Yup.string().max(500, "too long!"),
});

type emailForm = Yup.InferType<typeof valSchema>;

export default function EmailForm({ setIsEmailPopupOpen, initData }: Props) {
  const emailFormRef = useRef<FormikProps<emailForm>>(null);

  return (
    <div className="absolute top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-accent-800">
      <div className="mx-4 w-full rounded-lg bg-white dark:bg-neutral-700 md:w-[30rem]">
        <Formik
          innerRef={emailFormRef}
          validationSchema={valSchema}
          initialValues={{
            email: initData?.clientEmail ?? "",
            emailMessage: `Hi! ${
              initData?.clientName ?? ""
            } \n\nI'm sending my invoice in attachment\n\nBest Regard\n${
              initData?.name ?? ""
            }`,
          }}
          onSubmit={(value) => {
            console.log(value);
            console.log("id", initData?.id);
            // TODO: Send request
          }}
        >
          <>
            <div className="flex items-center justify-between border-b border-b-neutral-400 p-4 dark:border-b-primary-100">
              <h3 className="text-xl dark:text-neutral-800">
                Send {initData?.number}
              </h3>
              <div
                onClick={() => setIsEmailPopupOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border hover:border-primary-100 hover:text-primary-100 dark:border-neutral-800 dark:text-neutral-800 hover:dark:border-primary-100 hover:dark:text-primary-100"
              >
                <span className="mt-1">X</span>
              </div>
            </div>
            <Form className="px-4 py-8">
              <CustomInput id="email" label="Email" name="email" />
              <CustomTextArea
                id="emailMessage"
                label="Message"
                name="emailMessage"
                styles="my-5"
              />
              <div className="flex justify-end">
                <Button type="submit" stylemode="primary">
                  <span>send icon</span>
                  <span>Send</span>
                </Button>
              </div>
            </Form>
          </>
        </Formik>
      </div>
    </div>
  );
}
