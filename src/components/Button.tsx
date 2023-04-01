import React from "react";

type Props = {
  styleMode?: "default" | "accent" | "primary";
};

const styles = {
  default:
    "bg-neutral-600 text-neutral-900 dark:bg-neutral-200 dark:text-neutral-300",
  accent: "bg-accent-400 text-white",
  primary: "bg-primary-100 text-white",
};

export default function Button({
  styleMode,
  ...props
}: Props &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      className={`rounded-3xl px-4 py-3 text-sm font-bold   ${
        styleMode ? styles[styleMode] : styles["default"]
      }`}
      {...props}
    >
      {props.children}
    </button>
  );
}
