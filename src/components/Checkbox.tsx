import React, { type ChangeEvent } from "react";

type Props = {
  text: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({ onChange, text }: Props) {
  return (
    <label className="group flex items-center gap-x-3">
      <input
        className="peer invisible appearance-none"
        type="checkbox"
        name=""
        id=""
        onChange={onChange}
      />
      <span
        className="relative block h-4 w-4 rounded-sm border border-transparent bg-neutral-800 text-sm font-bold group-hover:border-primary-100 peer-checked:bg-primary-100 
    peer-checked:before:absolute peer-checked:before:top-1/2 peer-checked:before:left-1/2 peer-checked:before:h-[0.55rem] peer-checked:before:w-[0.3rem] peer-checked:before:-translate-x-1/2 peer-checked:before:-translate-y-1/2 peer-checked:before:rotate-45 peer-checked:before:border-r-2 peer-checked:before:border-b-2 peer-checked:before:border-solid peer-checked:before:border-white"
      ></span>
      {text}
    </label>
  );
}
