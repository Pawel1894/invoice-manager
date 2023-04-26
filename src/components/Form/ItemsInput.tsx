import { FieldArray, useField, useFormikContext } from "formik";
import React from "react";
import CustomInput from "./CustomInput";
import type { InvoiceItem } from "@prisma/client";
import { countryName, formatCurrency, getGross } from "~/utils/calcs";
import { format } from "number-to-local-currency";

type InputProps = {
  label: string;
  name: string;
  validate?: (value: any) => undefined | string | Promise<any>;
  value?: string;
  id: string;
  styles?: string;
};
type items = Array<InvoiceItem>;

export default function ItemsInput(props: InputProps) {
  const [field] = useField(props);
  const currency = useField("currency");
  const values = field.value as items;

  return (
    <div>
      <label className="block text-lg font-bold text-neutral-900">
        {props.label}
      </label>
      <FieldArray
        name={props.name}
        render={(arrayHelpers) => (
          <div data-testid="insert-items-container">
            {values.map((item, index) => (
              <div
                data-testid={`insert-item-${index}`}
                className={`${index !== 0 ? "mt-12" : "mt-6"}`}
                key={index}
              >
                <div className="mt-6 grid  grid-cols-[2fr_3fr_3fr] items-center gap-x-3 gap-y-6 lg:grid-cols-[6fr_2fr_3fr_3fr] lg:gap-x-4">
                  <CustomInput
                    type="text"
                    label="Item Name"
                    styles="col-span-full lg:col-span-1"
                    name={`items[${index}].name`}
                    id={`items[${index}].name`}
                    errorBottom={true}
                  />
                  <CustomInput
                    type="number"
                    label="Qty."
                    name={`items.${index}.quantity`}
                    id={`items.${index}.quantity`}
                    errorBottom={true}
                  />
                  <CustomInput
                    type="number"
                    label="Price"
                    name={`items.${index}.price`}
                    id={`items.${index}.price`}
                    errorBottom={true}
                  />

                  <CustomInput
                    type="number"
                    label="Tax %"
                    name={`items.${index}.tax`}
                    id={`items.${index}.tax`}
                    errorBottom={true}
                  />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-full">
                    <label
                      className={`mb-2 block text-sm text-neutral-900 dark:text-neutral-600`}
                    >
                      Net
                    </label>
                    <span
                      data-testid={`items.${index}.net`}
                      className="block max-w-[8rem] overflow-hidden text-ellipsis whitespace-nowrap text-neutral-400 dark:text-neutral-800 lg:max-w-[14rem]"
                    >
                      {isNaN(item.quantity * item.price)
                        ? formatCurrency(currency[1].value as countryName, 0)
                        : formatCurrency(
                            currency[1].value as countryName,
                            item.quantity * item.price
                          )}
                    </span>
                  </div>
                  <div className="w-full">
                    <label
                      className={`mb-2 block text-sm text-neutral-900 dark:text-neutral-600`}
                    >
                      Gross
                    </label>
                    <span
                      data-testid={`items.${index}.gross`}
                      className="block max-w-[8rem] overflow-hidden text-ellipsis whitespace-nowrap text-neutral-400 dark:text-neutral-800 lg:max-w-[14rem]"
                    >
                      {getGross(
                        item.quantity * item.price,
                        item.tax,
                        currency[1].value as countryName
                      )}
                    </span>
                  </div>
                  <button
                    className="translate-y-3"
                    type="button"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    <svg
                      width="13"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                        className="fill-[#888EB0] hover:fill-primary-200 dark:fill-neutral-800 dark:hover:fill-primary-200"
                        fillRule="nonzero"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              data-testid="insert-new-item"
              className="mt-12 w-full rounded-3xl bg-neutral-600 pb-2 pt-[12px] text-center font-bold text-neutral-900 dark:bg-neutral-200 dark:text-neutral-600"
              type="button"
              onClick={() =>
                arrayHelpers.push({
                  name: "",
                  quantity: 1,
                  price: 0,
                  tax: 0,
                  net: 0,
                  gross: 0,
                })
              }
            >
              + Add New Item
            </button>
          </div>
        )}
      />
    </div>
  );
}
