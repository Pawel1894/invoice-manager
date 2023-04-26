import React from "react";

type Props = {
  stylemode?: "default" | "accent" | "primary" | "danger";
  className?: string;
  type?: "submit" | "button";
};

const styles = {
  default:
    "bg-neutral-600 text-neutral-900 dark:bg-neutral-200 dark:text-neutral-300 hover:bg-neutral-950 dark:hover:bg-neutral-250",
  accent: "bg-accent-400 text-white hover:bg-neutral-900",
  primary: "bg-primary-100 text-white hover:bg-primary-200",
  danger: "bg-accent-100 text-white hover:bg-accent-200",
};

export default function Button({
  stylemode,
  className,
  type,
  ...props
}: Props &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      type={type}
      className={`rounded-3xl px-4 pb-[0.65rem] pt-[11px] text-sm  font-bold   ${
        stylemode ? styles[stylemode] : styles["default"]
      } ${className ? className : ""}`}
      {...props}
    >
      {props.children}
    </button>
  );
}
