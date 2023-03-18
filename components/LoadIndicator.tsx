import React from "react";

const styleVariants = {
  primary: "border-primary-100",
  accent: "border-accent-100",
};

type Props = {
  color?: "primary" | "accent";
  size?: `${number}rem`;
};

export default function LoadIndicator({ color, size }: Props) {
  return (
    <div
      style={{
        width: size ?? "3rem",
        height: size ?? "3rem",
      }}
      className={`h-12 w-12 animate-spin rounded-full border ${
        color ? styleVariants[color] : styleVariants["primary"]
      } border-t-[transparent]`}
    ></div>
  );
}
