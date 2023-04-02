import React from "react";

type Props = {
  stylemode?: "default" | "accent" | "primary";
  className?: string;
};

const styles = {
  default:
    "bg-neutral-600 text-neutral-900 dark:bg-neutral-200 dark:text-neutral-300",
  accent: "bg-accent-400 text-white",
  primary: "bg-primary-100 text-white",
};

export default function Button({
  stylemode,
  className,
  ...props
}: Props &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      className={`rounded-3xl px-4 py-3 text-sm font-bold   ${
        stylemode ? styles[stylemode] : styles["default"]
      } ${className ? className : ""}`}
      {...props}
    >
      {props.children}
    </button>
  );
}
