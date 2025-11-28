// frontend/src/services/api.ts

// TROQUE pelo IP da sua máquina na rede (o mesmo que aparece no Expo)
// Exemplo: http://192.168.18.45:8000
const API_BASE_URL = "http://192.168.18.45:8000"; // <- ajuste aqui

type LoginResponse = {
  message: string;
  usuario_id: string;
  status_conta: string;
};

export async function loginRequest(email: string, senha: string): Promise<LoginResponse> {
  console.log("🔵 [loginRequest] Chamando /login...", { email });

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json().catch(() => null);
  console.log("🟡 [loginRequest] status:", response.status, "body:", data);

  if (!response.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao fazer login. Tente novamente.";
    throw new Error(msg);
  }

  return data as LoginResponse;
}

export async function registerRequest(
  nome: string,
  email: string,
  senha: string
): Promise<{ status: number; body: any }> {
  console.log("🔵 [registerRequest] Chamando /usuarios...", { nome, email });

  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await response.json().catch(() => null);
  console.log("🟡 [registerRequest] status:", response.status, "body:", data);

  return { status: response.status, body: data };
}

export async function getUser(usuarioId: string) {
  console.log("🔵 [getUser] Buscando usuário:", usuarioId);

  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`);

  const data = await response.json().catch(() => null);
  console.log("🟡 [getUser] status:", response.status, "body:", data);

  if (!response.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao buscar dados do usuário.";
    throw new Error(msg);
  }

  return data as {
    id: string;
    nome: string;
    email: string;
    telefone_whatsapp: string | null;
    status_conta: string;
    data_criacao: string;
  };
}

export async function updateUserPhone(usuarioId: string, telefone: string) {
  console.log("🔵 [updateUserPhone] Atualizando telefone:", { usuarioId, telefone });

  const response = await fetch(
    `${API_BASE_URL}/usuarios/${usuarioId}/telefone`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefone_whatsapp: telefone }),
    }
  );

  const data = await response.json().catch(() => null);
  console.log("🟡 [updateUserPhone] status:", response.status, "body:", data);

  if (!response.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao atualizar telefone.";
    throw new Error(msg);
  }

  return data as {
    id: string;
    nome: string;
    email: string;
    telefone_whatsapp: string | null;
    status_conta: string;
    data_criacao: string;
  };
}

export type Telefone = {
  id: number;
  nome: string;
  numero: string;
  is_principal: boolean;
};

export async function getPhones(usuarioId: string): Promise<Telefone[]> {
  console.log("🔵 [getPhones] Buscando telefones do usuário:", usuarioId);

  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}/telefones`);

  const data = await response.json().catch(() => null);
  console.log("🟡 [getPhones] status:", response.status, "body:", data);

  if (!response.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao buscar telefones do usuário.";
    throw new Error(msg);
  }

  return data as Telefone[];
}

export async function createPhone(
  usuarioId: string,
  nome: string,
  numero: string,
  isPrincipal: boolean
): Promise<Telefone> {
  console.log("🔵 [createPhone] Criando telefone...", { usuarioId, nome, numero, isPrincipal });

  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}/telefones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, numero, is_principal: isPrincipal }),
  });

  const data = await response.json().catch(() => null);
  console.log("🟡 [createPhone] status:", response.status, "body:", data);

  if (!response.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao criar telefone.";
    throw new Error(msg);
  }

  return data as Telefone;
}

export async function updatePhone(
  usuarioId: string,
  telefoneId: number,
  payload: { nome?: string; numero?: string; is_principal?: boolean }
): Promise<Telefone> {
  console.log("🔵 [updatePhone] Atualizando telefone...", { usuarioId, telefoneId, payload });

  const response = await fetch(
    `${API_BASE_URL}/usuarios/${usuarioId}/telefones/${telefoneId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => null);
  console.log("🟡 [updatePhone] status:", response.status, "body:", data);

  if (!response.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao atualizar telefone.";
    throw new Error(msg);
  }

  return data as Telefone;
}

export async function deletePhone(
  usuarioId: string,
  telefoneId: number
): Promise<void> {
  console.log("🔵 [deletePhone] Removendo telefone...", { usuarioId, telefoneId });

  const response = await fetch(
    `${API_BASE_URL}/usuarios/${usuarioId}/telefones/${telefoneId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao remover telefone.";
    throw new Error(msg);
  }
}

export async function startWhatsapp(
  usuarioId: string,
  telefoneId?: number
): Promise<{ message: string; execution_id?: string }> {
  console.log("🔵 [startWhatsapp] Iniciando WhatsApp...", { usuarioId, telefoneId });

  const response = await fetch(`${API_BASE_URL}/whatsapp/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_id: usuarioId,
      telefone_id: telefoneId ?? null,
    }),
  });

  const data = await response.json().catch(() => null);
  console.log("🟡 [startWhatsapp] status:", response.status, "body:", data);

  if (!response.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      "Erro ao iniciar contato pelo WhatsApp.";
    throw new Error(msg);
  }

  return data as { message: string; execution_id?: string };
}
