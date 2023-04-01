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
        <Listbox.Button className="relative w-full rounded border border-neutral-900 py-[0.625rem] px-5 text-left font-bold text-neutral-500 hover:border-primary-200 focus:border-primary-200 active:border-primary-200">
          {label}
        </Listbox.Button>
        <Listbox.Options
          className={
            "absolute top-full left-0 w-full rounded-lg bg-white shadow-md"
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
