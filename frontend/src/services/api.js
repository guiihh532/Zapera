// coloque aqui o IP da SUA máquina, o mesmo que aparece no Expo (ex: 192.168.18.45)
const API_BASE_URL = "http://192.168.18.45:8000"; // <-- troque esse IP pelo seu

export const loginRequest = async (email, senha) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      "Erro ao fazer login. Tente novamente.";
    throw new Error(message);
  }

  return data;
};