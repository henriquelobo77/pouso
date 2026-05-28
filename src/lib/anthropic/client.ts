import Anthropic from "@anthropic-ai/sdk";

/**
 * Cliente Anthropic singleton para uso em server actions / route handlers.
 * NUNCA importar em Client Components — vazaria a key.
 */
let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY ausente nas env vars.");
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export const MODELS = {
  // Modelo principal — classificação, extração estruturada, chat
  default: "claude-sonnet-4-5",
  // Modelo rápido — captura quick (classificar gasto/tarefa em 1 frase)
  fast: "claude-haiku-4-5",
} as const;
