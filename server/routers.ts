import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { getDb } from "./db";
import { leads } from "../drizzle/schema";
import { sendLeadEmail } from "./email";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Endpoint para captura de leads
  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
          email: z.string().email("Email inválido"),
          phone: z.string().min(6, "Telefone inválido"),
          message: z.string().optional(),
          source: z.enum(["contact_form", "exit_intent"]).default("contact_form"),
        })
      )
      .mutation(async ({ input }) => {
        let savedId: number | null = null;

        // 1. Salvar no banco de dados
        try {
          const db = await getDb();
          if (db) {
            const result = await db.insert(leads).values({
              name: input.name,
              email: input.email,
              phone: input.phone,
              message: input.message ?? null,
              source: input.source,
            });
            savedId = (result as any)[0]?.insertId ?? null;
            console.log(`[Leads] Lead salvo no banco. ID: ${savedId}`);
          }
        } catch (err) {
          console.error("[Leads] Erro ao salvar no banco:", err);
        }

        // 2. Enviar email de notificação via SMTP
        const emailSent = await sendLeadEmail({
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
          source: input.source,
        });

        // 3. Se o email SMTP falhar, usar notificação interna como fallback
        if (!emailSent) {
          try {
            const sourceLabel = input.source === 'exit_intent' ? 'Popup de Saída' : 'Formulário de Contato';
            await notifyOwner({
              title: `🚀 Novo Lead: ${input.name} — Mantovani Tech`,
              content: `**Nome:** ${input.name}\n**Email:** ${input.email}\n**Telefone:** ${input.phone}${input.message ? `\n**Mensagem:** ${input.message}` : ''}\n**Origem:** ${sourceLabel}\n**Data:** ${new Date().toLocaleString('pt-BR')}`,
            });
            console.log('[Leads] Notificação interna enviada como fallback.');
          } catch (notifErr) {
            console.warn('[Leads] Falha na notificação interna:', notifErr);
          }
        }

        return {
          success: true,
          savedId,
          emailSent,
          message: "Lead recebido com sucesso!",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
