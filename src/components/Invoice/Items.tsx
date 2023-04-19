import type { InvoiceItem } from "@prisma/client";
import React from "react";
import { type countryName, formatCurrency } from "~/utils/calcs";

type Props = {
  items: Array<InvoiceItem>;
  currencyCountry: string;
};

export default function Items({ items, currencyCountry }: Props) {
  return (
    <div className="mt-9 rounded-t-lg bg-neutral-600 p-6">
      <div className="hidden lg:block">
        <span>Item Name</span>
        <span>QTY.</span>
        <span>Price</span>
        <span>Tax</span>
        <span>Net</span>
        <span>Gross</span>
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
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      <span className="font-bold">{data.name}</span>
      <span className="hidden">{data.quantity}</span>
      <span className="col-start-1 row-start-2 text-sm text-neutral-900">
        <span className="lg:hidden">{data.quantity} x</span>{" "}
        {formatCurrency(country as countryName, data.price)}
      </span>
      <span className="hidden">{data.tax}</span>
      <span className="text-sm">
        {formatCurrency(country as countryName, data.net)}
      </span>
      <span className="text-sm">
        {formatCurrency(country as countryName, data.gross)}
      </span>
    </div>
  );
}
