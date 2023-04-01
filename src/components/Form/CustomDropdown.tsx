import { Listbox } from "@headlessui/react";
import React from "react";
export type CustomDropdownOption<T> = {
  label: string;
  value: T;
};
export type CustomDropdownProps<T> = {
  options: CustomDropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const CustomDropdown = <T,>(props: CustomDropdownProps<T>) => {
  const options = props.options;
  const selectedItem = options.find((o) => o.value === props.value);
  const label = selectedItem?.label ?? "Select Option...";
  return (
    <Listbox value={props.value} onChange={props.onChange} as={React.Fragment}>
      <div className={"relative w-full"}>
        <Listbox.Button className="relative flex w-full items-center justify-between rounded border border-neutral-900 py-[0.625rem] px-5 text-left font-bold text-neutral-500 hover:border-primary-200 focus:border-primary-200 active:border-primary-200 dark:border-neutral-100 dark:bg-neutral-200 dark:text-neutral-600">
          <span>{label}</span>
          <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1l4.228 4.228L9.456 1"
              stroke="#7C5DFA"
              stroke-width="2"
              fill="none"
              fill-rule="evenodd"
            />
          </svg>
        </Listbox.Button>
        <Listbox.Options
          className={
            "absolute top-full left-0 w-full rounded-lg bg-white shadow-md dark:bg-neutral-200 dark:text-neutral-600"
          }
        >
          {options.map((option, i) => (
            <Listbox.Option
              className={`w-full  ${
                i !== options.length - 1 ? "border-b border-b-neutral-400" : ""
              }`}
              key={i}
              value={option.value}
            >
              {({ active, disabled, selected }) => (
                <button
                  className={`${
                    active || selected ? "text-primary-100" : ""
                  } w-full py-4 pl-6 text-left `}
                >
                  {option.label}
                </button>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
export default CustomDropdown;
