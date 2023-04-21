import type { InvoiceItem } from "@prisma/client";
import React from "react";
import { type countryName, formatCurrency } from "~/utils/calcs";

type Props = {
  items: Array<InvoiceItem>;
  currencyCountry: string;
};

export default function Items({ items, currencyCountry }: Props) {
  return (
    <div className="mt-9 rounded-t-lg bg-neutral-600 p-6 dark:bg-neutral-200 lg:mt-12">
      <div className="hidden  grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-x-3 lg:mb-8 lg:grid">
        <span className="dark:text-white">Item Name</span>
        <span className="dark:text-white">QTY.</span>
        <span className="dark:text-white">Price</span>
        <span className="dark:text-white">Tax</span>
        <span className="dark:text-white">Net</span>
        <span className="dark:text-white">Gross</span>
      </div>
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <Item data={item} country={currencyCountry} key={item.id} />
        ))}
      </div>
    </div>
  );
}

function Item({ data, country }: { data: InvoiceItem; country: string }) {
  return (
    <div className="grid grid-cols-2 justify-center gap-x-6 gap-y-2 dark:text-white lg:grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] lg:gap-x-3 lg:gap-y-0">
      <span
        title={data.name}
        className="overflow-hidden text-ellipsis font-bold lg:block lg:font-normal"
      >
        {data.name}
      </span>
      <span
        title={String(data.quantity)}
        className="hidden overflow-hidden text-ellipsis lg:block"
      >
        {data.quantity}
      </span>
      <span
        title={formatCurrency(country as countryName, data.price)}
        className="col-start-1 row-start-2 overflow-hidden text-ellipsis text-sm text-neutral-900 dark:text-white lg:col-auto lg:row-auto lg:block lg:text-black"
      >
        <span className="lg:hidden ">{data.quantity} x</span>{" "}
        {formatCurrency(country as countryName, data.price)}
      </span>
      <span
        title={String(data.tax)}
        className="hidden overflow-hidden text-ellipsis lg:block"
      >
        {data.tax}
      </span>
      <span
        title={formatCurrency(country as countryName, data.net)}
        className="block overflow-hidden text-ellipsis text-sm"
      >
        {formatCurrency(country as countryName, data.net)}
      </span>
      <span
        title={formatCurrency(country as countryName, data.gross)}
        className="block overflow-hidden text-ellipsis text-sm"
      >
        {formatCurrency(country as countryName, data.gross)}
      </span>
    </div>
  );
}
