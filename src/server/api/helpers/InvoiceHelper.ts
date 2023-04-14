import { type PrismaClient } from "@prisma/client";
import { type CreateInvoiceInput } from "../routers/invoice";

export async function createInvoice(
  input: CreateInvoiceInput,
  userId: string,
  prisma: PrismaClient
) {
  const dueDate = new Date(input.invoiceDate);
  dueDate.setDate(dueDate.getDate() + input.paymentTerms);

  let totalAmount = 0;
  input.items.forEach((item) => (totalAmount += item.price * item.quantity));

  let grossTotalAmount = 0;
  input.items.forEach(
    (item) =>
      (grossTotalAmount +=
        item.price * item.quantity +
        item.price * item.quantity * (item.tax / 100))
  );

  const invoice = await prisma.invoice.create({
    data: {
      userId: userId,
      number: input.invoiceNum,
      invoiceDate: input.invoiceDate,
      dueDate: dueDate,
      streetAddress: input.streetAddress,
      city: input.city,
      postCode: input.postCode,
      country: input.country,
      bankAccount: input.bankAccount,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientStreetAddress: input.clientStreetAddress,
      clientCity: input.clientCity,
      clientPostCode: input.clientPostCode,
      clientCountry: input.clientCountry,
      decription: input.projectDescription,
      totalAmount: totalAmount,
      currencyCountry: input.currency,
      grossTotalAmount: grossTotalAmount,
      status: input.status,
      name: input.name,
      idNo: input.idNo,
      clientId: input.clientId,
    },
  });
  return invoice;
}

export async function assingInvoiceItems(
  items: CreateInvoiceInput["items"],
  invoiceId: string,
  prisma: PrismaClient
) {
  const newItems = items.map((item) => {
    return {
      ...item,
      net: item.price * item.quantity,
      gross:
        item.price * item.quantity +
        item.price * item.quantity * (item.tax / 100),
      invoiceId,
    };
  });

  await prisma.invoiceItem.createMany({
    data: newItems,
  });
}
