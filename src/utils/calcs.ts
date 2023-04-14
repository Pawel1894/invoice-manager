import countryToCurrency from "country-to-currency";

export function getGross(base: number, tax: number, country: countryName) {
  const percentage = tax / 100;
  const result = base * percentage;

  if (isNaN(result)) return "0";

  return formatCurrency(country, base + result);
}

export type countryName = "US" | "PL" | "GB" | "DE";

export function formatCurrency(country: countryName, value: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: countryToCurrency[country],
  });

  return formatter.format(value);
}
