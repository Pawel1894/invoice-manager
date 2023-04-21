import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { createTRPCRouter } from "~/server/api/trpc";
import { assingInvoiceItems, createInvoice } from "../helpers/InvoiceHelper";
import { sendEmail } from "~/utils/mailer";
import { generateInvoiceDoc } from "~/utils/pdf";
import { inputCSS } from "react-select/dist/declarations/src/components/Input";

const CreateInvoiceSchema = z.object({
  name: z.string().max(80, "too long!").nonempty("can't be empty"),
  idNo: z.string().max(40, "too long!"),
  clientId: z.string().max(40, "too long!"),
  status: z.enum(["DRAFT", "PENDING", "PAID"]),
  streetAddress: z.string().nonempty("can't be empty"),
  city: z.string().nonempty("can't be empty"),
  postCode: z.string().nonempty("can't be empty"),
  country: z.string().nonempty("can't be empty"),
  currency: z.string(),
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
      tax: z.number(),
      net: z.number(),
      gross: z.number(),
    })
  ),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

export const invoiceRouter = createTRPCRouter({
  getInvoices: protectedProcedure
    .input(
      z
        .object({
          Paid: z.boolean(),
          Pending: z.boolean(),
          Draft: z.boolean(),
        })
        .nullable()
    )
    .query(async ({ ctx, input }) => {
      const filterStatus: Array<"DRAFT" | "PAID" | "PENDING"> = [];

      if (input) {
        input.Draft ? filterStatus.push("DRAFT") : null;
        input.Paid ? filterStatus.push("PAID") : null;
        input.Pending ? filterStatus.push("PENDING") : null;
      }

      return await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
          AND: {
            status: {
              in:
                filterStatus?.length > 0
                  ? filterStatus
                  : ["DRAFT", "PAID", "PENDING"],
            },
          },
        },
        orderBy: {
          invoiceDate: "desc",
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.invoice.findFirst({
      where: {
        userId: ctx.session.user.id,
        AND: {
          id: input,
        },
      },
      include: {
        items: true,
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
          clientId: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
  sendInvoice: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string().nonempty("can't be empty"),
        message: z.string(),
        recipient: z.string().email("must be email"),
        userName: z.string().nonempty("can't be empty"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.prisma.invoice.findFirst({
        where: {
          id: input.invoiceId,
        },
        include: {
          items: true,
        },
      });

      if (invoice?.status === "DRAFT") {
        await ctx.prisma.invoice.update({
          where: {
            id: input.invoiceId,
          },
          data: {
            status: "PENDING",
          },
        });
      }

      if (!invoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      try {
        const invoiceDoc = await generateInvoiceDoc(ctx.origin, invoice);

        const attachment = {
          content: Buffer.from(invoiceDoc).toString("base64"),
          filename: `${invoice.name} ${invoice.number}`,
          type: "application/pdf",
          disposition: "attachment",
        };

        const response = await sendEmail(
          input.recipient,
          input.message,
          input.invoiceId,
          input.userName,
          [attachment]
        );
        if (response !== 202) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Sending email failed.",
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Generating pdf file failed",
        });
      }
      return "Success";
    }),
  getPdfDoc: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string().nonempty("can't be empty"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.prisma.invoice.findFirst({
        where: {
          id: input.invoiceId,
        },
        include: {
          items: true,
        },
      });

      if (!invoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      try {
        const invoiceDoc = await generateInvoiceDoc(ctx.origin, invoice);
        return (
          "data:application/pdf;base64," +
          Buffer.from(invoiceDoc).toString("base64")
        );
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Generating pdf file failed",
        });
      }
    }),
  setStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(["DRAFT", "PENDING", "PAID"]),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.prisma.invoice.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return invoice;
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.invoice.delete({
      where: {
        id: input,
      },
    });
  }),
});
