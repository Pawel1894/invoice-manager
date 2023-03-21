import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getPrefTheme: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session?.user.id,
      },
      select: {
        darkMode: true,
      },
    });
  }),
  setPrefTheme: protectedProcedure
    .input(z.boolean())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session?.user.id,
        },
        data: {
          darkMode: input,
        },
      });
    }),
});
