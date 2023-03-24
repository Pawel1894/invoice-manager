import { protectedProcedure } from "~/server/api/trpc";
import { createTRPCRouter } from "~/server/api/trpc";

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
});
