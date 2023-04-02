import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { createTRPCRouter } from "~/server/api/trpc";

const createSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "PAID"]),
  streetAddress: z
    .string()
    .min(1)
    .max(40)
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  city: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  postCode: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  country: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  clientName: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  clientStreetAddress: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  clientCity: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  clientPostCode: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  invoiceNum: z.string().nonempty("can't be empty"),
  bankAccount: z.string(),
  clientCountry: z
    .string()
    .min(1, "too short!")
    .max(40, "too long!")
    .nonempty("can't be empty"),
  invoiceDate: z.date(),
  clientEmail: z.string().email("must be a valid email"),
  projectDescription: z.string(),
  paymentTerms: z.number().min(1),
  items: z.array(
    z.object({
      name: z
        .string()
        .min(1, "too short!")
        .max(40, "too long!")
        .nonempty("can't be empty"),
      quantity: z.number().nonnegative("can't be negative"),
      price: z.number().nonnegative("can't be negative"),
      total: z.number(),
    })
  ),
});

export const invoiceRouter = createTRPCRouter({
  getInvoices: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.invoice.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        invoiceDate: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const dueDate = new Date(input.invoiceDate);
      dueDate.setDate(dueDate.getDate() + input.paymentTerms);

      let totalAmount = 0;
      input.items.forEach(
        (item) => (totalAmount += item.price * item.quantity)
      );

      const invoice = await ctx.prisma.invoice.create({
        data: {
          userId: ctx.session.user.id,
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
        },
      });

      // add items for this invoice
      const items = input.items.map((item) => {
        return {
          ...item,
          total: item.price * item.quantity,
          invoiceId: invoice.id,
        };
      });

      await ctx.prisma.invoiceItem.createMany({
        data: items,
      });

      return invoice;
    }),
});
