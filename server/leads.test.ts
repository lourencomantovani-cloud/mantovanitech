import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock do módulo de email para não enviar emails reais nos testes
vi.mock("./email", () => ({
  sendLeadEmail: vi.fn().mockResolvedValue(true),
}));

// Mock do banco de dados
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
    }),
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("leads.submit", () => {
  it("deve aceitar um lead válido com todos os campos", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submit({
      name: "Felipe Mantovani",
      email: "felipe@mantovanitech.com",
      phone: "+39 392 017 2546",
      message: "Gostaria de saber mais sobre os serviços",
      source: "contact_form",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Lead recebido com sucesso!");
    expect(result.emailSent).toBe(true);
  });

  it("deve aceitar um lead sem mensagem (campo opcional)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submit({
      name: "João Silva",
      email: "joao@empresa.com",
      phone: "+55 41 98776-8901",
      source: "exit_intent",
    });

    expect(result.success).toBe(true);
  });

  it("deve rejeitar email inválido", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        name: "Teste",
        email: "email-invalido",
        phone: "+55 41 99999-9999",
      })
    ).rejects.toThrow();
  });

  it("deve rejeitar nome muito curto", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        name: "A",
        email: "teste@email.com",
        phone: "+55 41 99999-9999",
      })
    ).rejects.toThrow();
  });
});
