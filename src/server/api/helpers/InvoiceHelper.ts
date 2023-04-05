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
      status: input.status,
      name: input.name,
      idNo: input.idNo,
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
      total: item.price * item.quantity,
      invoiceId,
    };
  });

  await prisma.invoiceItem.createMany({
    data: newItems,
  });
}
