import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { createTRPCRouter } from "~/server/api/trpc";
import { assingInvoiceItems, createInvoice } from "../helpers/InvoiceHelper";

const CreateInvoiceSchema = z.object({
  name: z.string().max(80, "too long!").nonempty("can't be empty"),
  idNo: z.string().max(40, "too long!"),
  status: z.enum(["DRAFT", "PENDING", "PAID"]),
  streetAddress: z.string(),
  city: z.string(),
  postCode: z.string(),
  country: z.string(),
  clientName: z.string().max(40, "too long!").nonempty("can't be empty"),
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
      name: z.string().max(40, "too long!").nonempty("can't be empty"),
      quantity: z.number().nonnegative("can't be negative"),
      price: z.number().nonnegative("can't be negative"),
      total: z.number(),
    })
  ),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

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
    .input(CreateInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      const invoice = await createInvoice(
        input,
        ctx.session.user.id,
        ctx.prisma
      );

      if (!invoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Saving invoice failed please try again.",
        });
      }

      await assingInvoiceItems(input.items, invoice.id, ctx.prisma);

      return invoice;
    }),
  lastUserData: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.invoice.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        streetAddress: true,
        city: true,
        postCode: true,
        country: true,
        bankAccount: true,
        name: true,
        idNo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });
  }),
  clientAutocomplete: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findMany({
        distinct: ["clientName"],
        where: {
          userId: ctx.session.user.id,
          AND: {
            clientName: {
              contains: input,
            },
          },
        },
        select: {
          clientName: true,
          clientEmail: true,
          clientStreetAddress: true,
          clientCity: true,
          clientPostCode: true,
          clientCountry: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
