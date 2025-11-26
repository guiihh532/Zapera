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