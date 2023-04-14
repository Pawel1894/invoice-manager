import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { api } from "~/utils/api";
import { Combobox } from "@headlessui/react";

type Props = {
  name: string;
  label: string;
  id: string;
};

interface Client {
  clientName: string;
  clientEmail: string;
  clientStreetAddress: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;
  clientId: string;
}

export default function ClientAutocomplete(props: Props) {
  const [query, setQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { data: options } = api.invoice.clientAutocomplete.useQuery(query, {
    refetchOnWindowFocus: false,
  });
  const name = props.name;
  const [field, meta] = useField<string>(name);
  const { setFieldValue, setFieldTouched, validateField } = useFormikContext();

  const onSelectedOption = (client: Client | string) => {
    if (!(typeof client === "object")) return;
    setSelectedClient(client);
    setFieldValue(name, client.clientName);
    setFieldValue("clientEmail", client.clientEmail);
    setFieldValue("clientStreetAddress", client.clientStreetAddress);
    setFieldValue("clientCity", client.clientCity);
    setFieldValue("clientPostCode", client.clientPostCode);
    setFieldValue("clientCountry", client.clientCountry);
    setFieldValue("clientId", client.clientId);

    setFieldTouched("clientEmail", false);
    setFieldTouched("clientStreetAddress", false);
    setFieldTouched("clientCity", false);
    setFieldTouched("clientPostCode", false);
    setFieldTouched("clientCountry", false);
    setFieldTouched("clientId", false);
  };

  return (
    <div className="relative w-full">
      <label
        className={`mb-2 block text-sm  ${
          meta.touched && meta.error
            ? "text-accent-100"
            : "text-neutral-900 dark:text-neutral-600"
        }`}
        htmlFor={props.id || props.name}
      >
        {props.label}
      </label>
      <Combobox
        value={selectedClient || field.value}
        onChange={(e) => onSelectedOption(e)}
      >
        <Combobox.Input
          name={name}
          id={props.id}
          onBlur={() => {
            setFieldTouched(name, true);
            validateField(name);
          }}
          displayValue={(client: Client) => client.clientName || field.value}
          onChange={(event) => {
            setFieldValue(name, event.target.value);
            setQuery(event.target.value);
            setSelectedClient(null);
            // validateField(name);
          }}
          className={`w-full py-[0.625rem]  font-bold ${
            meta.touched && meta.error ? "!border-accent-100" : ""
          } rounded border border-neutral-900 px-5 text-neutral-500 hover:border-primary-200 focus:border-primary-200 active:border-primary-200 dark:border-neutral-100 dark:bg-neutral-200 dark:text-neutral-800 dark:hover:border-primary-200 dark:focus:border-primary-200 dark:active:border-primary-200  `}
        />
        <Combobox.Options
          className={
            "relative z-10 w-full rounded-lg bg-white px-2 shadow-md dark:bg-neutral-200 dark:text-neutral-600"
          }
        >
          {options &&
            options.length > 0 &&
            options.map((option) => (
              <Combobox.Option
                key={option.clientName}
                value={option}
                className=" cursor-pointer py-3 ui-active:text-primary-100 "
              >
                {option.clientName}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </Combobox>
      {meta.touched && meta.error ? (
        <div
          className={`absolute top-0 right-0 text-xs leading-5 text-accent-100`}
        >
          {meta.error}
        </div>
      ) : null}
    </div>
  );
}
