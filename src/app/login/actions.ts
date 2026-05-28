"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Cria (ou atualiza) o usuário com email_confirm = true, e em seguida
 * faz signInWithPassword pra setar os cookies de sessão.
 *
 * Bypassa o envio de email de confirmação do Supabase — útil em single-user
 * onde não queremos esperar SMTP / rate limits.
 */
export async function signupAction(email: string, password: string): Promise<Result> {
  email = email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Email inválido." };
  }
  if (!password || password.length < 8) {
    return { ok: false, error: "Senha precisa ter pelo menos 8 caracteres." };
  }

  const admin = adminClient();

  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: email.split("@")[0] },
  });

  if (createErr) {
    const msg = createErr.message.toLowerCase();
    // Se já existe, atualiza a senha e confirma email (single-user safe)
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      if (listErr) return { ok: false, error: listErr.message };
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);
      if (!existing) {
        return { ok: false, error: "Conta existe mas não foi encontrada. Contata suporte." };
      }
      const { error: updateErr } = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (updateErr) return { ok: false, error: updateErr.message };
    } else {
      return { ok: false, error: createErr.message };
    }
  }

  // Loga imediatamente pra setar cookies via @supabase/ssr server client.
  const supabase = await createServerClient();
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInErr) {
    return { ok: false, error: `Conta criada mas login falhou: ${signInErr.message}` };
  }

  return { ok: true };
}

/**
 * Signin via server action (cookies setados no servidor — mais robusto que
 * client-side quando há proxy de CDN/Vercel).
 */
export async function signinAction(email: string, password: string): Promise<Result> {
  email = email.trim().toLowerCase();
  if (!email || !password) {
    return { ok: false, error: "Email e senha são obrigatórios." };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
      return { ok: false, error: "Email ou senha incorretos." };
    }
    if (m.includes("email not confirmed")) {
      return { ok: false, error: "Email ainda não confirmado." };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
