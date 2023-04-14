import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { createTRPCRouter } from "~/server/api/trpc";
import { assingInvoiceItems, createInvoice } from "../helpers/InvoiceHelper";
import { sendEmail } from "~/utils/mailer";
import PDFDocument from "pdfkit";
import getStream from "get-stream";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

const CreateInvoiceSchema = z.object({
  name: z.string().max(80, "too long!").nonempty("can't be empty"),
  idNo: z.string().max(40, "too long!"),
  clientId: z.string().max(40, "too long!"),
  status: z.enum(["DRAFT", "PENDING", "PAID"]),
  streetAddress: z.string(),
  city: z.string(),
  postCode: z.string(),
  country: z.string(),
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
      // TODO: Generate pdf file and add as attachment

      const response = await sendEmail(
        input.recipient,
        input.message,
        input.invoiceId,
        input.userName
      );
      if (response !== 202) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sending email failed.",
        });
      }

      return "Success";
    }),
  testPdf: publicProcedure.mutation(async ({ ctx }) => {
    // const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream("output.pdf"));
    // doc.fontSize(25).text("Some text with an embedded font!", 100, 100);
    // doc.end();

    const invoice = await ctx.prisma.invoice.findFirst({
      where: {
        id: "clgf5zbtr001yv3wkkgx6l53e",
      },
    });

    if (!invoice) return;

    try {
      const doc = new PDFDocument();
      dayjs.extend(localizedFormat);
      doc.font("Helvetica-Bold").fontSize(11).text(`Invoice Number:`, 10, 40);

      doc.font("Helvetica").fontSize(11).text(`${invoice.number}`, 100, 40);

      doc.font("Helvetica-Bold").fontSize(11).text(`Created At:`, 10, 60);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`${dayjs(invoice.invoiceDate.toString()).format("LL")}`, 75, 60);

      doc.font("Helvetica-Bold").fontSize(11).text(`Due to:`, 10, 80);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`${dayjs(invoice.dueDate.toString()).format("LL")}`, 55, 80);

      doc
        .moveTo(10, 120)
        .lineTo(doc.page.width - 10, 120)
        .stroke();

      doc.font("Helvetica-Bold").fontSize(11).text(`Due to:`, 10, 80);

      doc.font("Helvetica-Bold").fontSize(12).text(`Bill from`, 10, 140);

      doc.font("Helvetica").fontSize(11).text(invoice.name, 10, 160);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`${invoice.streetAddress}`, 10, 180);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          `${invoice.postCode} ${invoice.city} ${invoice.country}`,
          10,
          200
        );

      doc.font("Helvetica").fontSize(11).text(`${invoice.idNo}`, 10, 220);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`Bank - ${invoice.bankAccount}`, 10, 240);

      doc.font("Helvetica-Bold").fontSize(12).text(`Bill To`, 300, 140);

      doc.font("Helvetica").fontSize(11).text(invoice.clientName, 300, 160);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`${invoice.clientStreetAddress}`, 300, 180);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          `${invoice.clientPostCode} ${invoice.clientCity} ${invoice.clientCountry}`,
          300,
          200
        );

      doc.font("Helvetica").fontSize(11).text(`${invoice.idNo}`, 300, 220);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`Bank - ${invoice.clientEmail}`, 300, 240);

      doc
        .moveTo(10, 260)
        .lineTo(doc.page.width - 10, 260)
        .stroke();

      doc.end();
      const pdfStream = await getStream.buffer(doc);
      // console.log("pdfStream", pdfStream);
      return (
        "data:application/pdf;base64," +
        Buffer.from(pdfStream).toString("base64")
      );
      // return pdfStream;
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "FAIL",
      });
    }
  }),
});
