import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getUser, getPhones, createPhone, updatePhone, deletePhone, Telefone } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
  const usuarioId = route.params?.usuarioId;

  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [statusConta, setStatusConta] = useState<string>("");

  const [telefones, setTelefones] = useState<Telefone[]>([]);
  const [editandoId, setEditandoId] = useState<null | number | "novo">(null);
  const [telefoneNome, setTelefoneNome] = useState<string>("");
  const [telefoneNumero, setTelefoneNumero] = useState<string>("");

  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvandoTelefone, setSalvandoTelefone] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  useEffect(() => {
    if (!usuarioId) {
      setMensagem("Usuário não identificado. Faça login novamente.");
      setCarregando(false);
      return;
    }

    const carregarDados = async () => {
      try {
        setCarregando(true);
        setMensagem(null);

        const user = await getUser(usuarioId);
        setNome(user.nome);
        setEmail(user.email);
        setStatusConta(user.status_conta);

        const phones = await getPhones(usuarioId);
        setTelefones(phones);
      } catch (err: any) {
        setMensagem(err.message || "Erro ao carregar dados do usuário.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [usuarioId]);

  const planoAtual =
    statusConta === "TRIAL_ATIVO"
      ? "Teste grátis Zapera"
      : statusConta === "ATIVO"
      ? "Plano Zapera Profissional"
      : "Plano a definir";

  const iniciarCriacaoTelefone = () => {
    setEditandoId("novo");
    setTelefoneNome("");
    setTelefoneNumero("");
    setMensagem(null);
  };

  const iniciarEdicaoTelefone = (telefone: Telefone) => {
    setEditandoId(telefone.id);
    setTelefoneNome(telefone.nome);
    setTelefoneNumero(telefone.numero);
    setMensagem(null);
  };

  const cancelarEdicaoTelefone = () => {
    setEditandoId(null);
    setTelefoneNome("");
    setTelefoneNumero("");
    setMensagem(null);
  };

  const handleSalvarTelefone = async () => {
    if (!usuarioId) return;

    if (!telefoneNome.trim() || !telefoneNumero.trim()) {
      setMensagem("Informe nome e número do telefone.");
      return;
    }

    try {
      setSalvandoTelefone(true);
      setMensagem(null);

      if (editandoId === "novo") {
        const isPrincipal = telefones.length === 0;
        const novo = await createPhone(
          usuarioId,
          telefoneNome.trim(),
          telefoneNumero.trim(),
          isPrincipal
        );
        setTelefones((prev) => [...prev, novo]);
        setMensagem("Telefone adicionado com sucesso.");
      } else if (typeof editandoId === "number") {
        const atualizado = await updatePhone(usuarioId, editandoId, {
          nome: telefoneNome.trim(),
          numero: telefoneNumero.trim(),
        });
        setTelefones((prev) =>
          prev.map((t) => (t.id === atualizado.id ? atualizado : t))
        );
        setMensagem("Telefone atualizado com sucesso.");
      }

      cancelarEdicaoTelefone();
    } catch (err: any) {
      setMensagem(err.message || "Erro ao salvar telefone.");
    } finally {
      setSalvandoTelefone(false);
    }
  };

  const handleRemoverTelefone = async (telefoneId: number) => {
    if (!usuarioId) return;
    try {
      await deletePhone(usuarioId, telefoneId);
      setTelefones((prev) => prev.filter((t) => t.id !== telefoneId));
      setMensagem("Telefone removido.");
      if (editandoId === telefoneId) {
        cancelarEdicaoTelefone();
      }
    } catch (err: any) {
      setMensagem(err.message || "Erro ao remover telefone.");
    }
  };

  const handleSetPrincipal = async (telefone: Telefone) => {
    if (!usuarioId) return;
    try {
      const atualizado = await updatePhone(usuarioId, telefone.id, {
        is_principal: true,
      });
      setTelefones((prev) =>
        prev.map((t) =>
          t.id === atualizado.id
            ? atualizado
            : { ...t, is_principal: false }
        )
      );
      setMensagem("Telefone principal atualizado.");
    } catch (err: any) {
      setMensagem(err.message || "Erro ao definir telefone principal.");
    }
  };

  const handleLogout = () => {
    setMenuAberto(false);
    navigation.replace("Login");
  };

  const handleAlterarSenha = () => {
    setMenuAberto(false);
    setMensagem("Em breve você poderá alterar sua senha por aqui.");
  };

  const handleFotoPerfil = () => {
    setMenuAberto(false);
    navigation.navigate("Profile");
  };

  if (!usuarioId) {
    return (
      <ScreenContainer centerContent>
        <Text style={styles.title}>Zapera – Home</Text>
        <Text style={styles.text}>
          Usuário não encontrado. Volte para a tela de login.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.primaryButtonText}>Ir para Login</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  if (carregando) {
    return (
      <ScreenContainer centerContent>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={[styles.text, { marginTop: 16 }]}>
          Carregando seus dados...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Cabeçalho + menu */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.userName}>{nome || "usuário Zapera"}</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{statusConta || "SEM_STATUS"}</Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuAberto((prev) => !prev)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#E5E7EB" />
          </TouchableOpacity>
        </View>
      </View>

      {menuAberto && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity style={styles.menuItem} onPress={handleAlterarSenha}>
            <Text style={styles.menuItemText}>Alterar senha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleFotoPerfil}>
            <Text style={styles.menuItemText}>Foto de perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={[styles.menuItemText, { color: "#F97373" }]}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Card de conta */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sua conta</Text>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.text}>{email}</Text>

        <Text style={styles.label}>Plano atual</Text>
        <Text style={styles.planText}>{planoAtual}</Text>
      </View>

      {/* Card de telefones */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Números do WhatsApp</Text>

        {telefones.length === 0 && editandoId === null && (
          <Text style={styles.text}>
            Nenhum telefone vinculado ainda. Adicione um número para o Zapera
            usar nas conversas.
          </Text>
        )}

        {telefones.map((tel) => (
          <View key={tel.id} style={styles.phoneRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneName}>{tel.nome}</Text>
              <Text style={styles.phoneNumber}>{tel.numero}</Text>
              {tel.is_principal && (
                <Text style={styles.phonePrincipal}>Principal</Text>
              )}
            </View>

            <View style={styles.phoneActions}>
              {!tel.is_principal && (
                <TouchableOpacity
                  style={styles.chipButton}
                  onPress={() => handleSetPrincipal(tel)}
                >
                  <Text style={styles.chipButtonText}>Tornar principal</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.linkSmall}
                onPress={() => iniciarEdicaoTelefone(tel)}
              >
                <Text style={styles.linkSmallText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkSmall}
                onPress={() => handleRemoverTelefone(tel.id)}
              >
                <Text style={[styles.linkSmallText, { color: "#F97373" }]}>
                  Remover
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {(editandoId === "novo" || typeof editandoId === "number") && (
          <View style={styles.phoneEditContainer}>
            <Text style={styles.label}>Nome do telefone</Text>
            <TextInput
              style={styles.input}
              value={telefoneNome}
              onChangeText={setTelefoneNome}
              placeholder="Ex.: Principal, Suporte, Pessoal"
              placeholderTextColor="#64748B"
            />

            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              value={telefoneNumero}
              onChangeText={setTelefoneNumero}
              placeholder="(99) 99999-9999"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
            />

            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  salvandoTelefone && styles.buttonDisabled,
                  { flex: 1 },
                ]}
                onPress={handleSalvarTelefone}
                disabled={salvandoTelefone}
              >
                {salvandoTelefone ? (
                  <ActivityIndicator color="#022C22" />
                ) : (
                  <Text style={styles.primaryButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1 }]}
                onPress={cancelarEdicaoTelefone}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {editandoId === null && (
          <TouchableOpacity
            style={[styles.secondaryButton, { marginTop: 12 }]}
            onPress={iniciarCriacaoTelefone}
          >
            <Text style={styles.secondaryButtonText}>Adicionar telefone</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Card de plano */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Plano e faturamento</Text>

        <Text style={styles.label}>Plano atual</Text>
        <Text style={styles.planText}>{planoAtual}</Text>

        <View style={styles.rowButtons}>
          <TouchableOpacity
            style={[styles.secondaryButton, { flex: 1 }]}
            onPress={() =>
              setMensagem(
                "Em breve você poderá ver os detalhes completos do plano aqui."
              )
            }
          >
            <Text style={styles.secondaryButtonText}>Ver detalhes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { flex: 1 }]}
            onPress={() =>
              setMensagem(
                "Em breve você poderá alterar o plano e fazer upgrade direto pelo app."
              )
            }
          >
            <Text style={styles.primaryButtonText}>Alterar plano</Text>
          </TouchableOpacity>
        </View>
      </View>

      {mensagem && <Text style={styles.message}>{mensagem}</Text>}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hello: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  userName: {
    color: "#F9FAFB",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: "#22C55E33",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "600",
  },
  menuButton: {
    padding: 6,
  },
  menuDropdown: {
    position: "absolute",
    top: 56,
    right: 24,
    backgroundColor: "#020617",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
    paddingVertical: 4,
    width: 180,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemText: {
    color: "#E5E7EB",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 2,
  },
  text: {
    color: "#CBD5E1",
    fontSize: 14,
  },
  planText: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#0B1120",
    padding: 10,
    borderRadius: 8,
    color: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#111827",
    marginTop: 4,
  },
  rowButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#022C22",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },
  secondaryButtonText: {
    color: "#E5E7EB",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  phoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
  },
  phoneName: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500",
  },
  phoneNumber: {
    color: "#CBD5E1",
    fontSize: 13,
  },
  phonePrincipal: {
    color: "#22C55E",
    fontSize: 11,
    marginTop: 2,
  },
  phoneActions: {
    alignItems: "flex-end",
    gap: 4,
  },
  chipButton: {
    backgroundColor: "#22C55E33",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipButtonText: {
    color: "#22C55E",
    fontSize: 11,
  },
  linkSmall: {
    paddingVertical: 2,
  },
  linkSmallText: {
    color: "#93C5FD",
    fontSize: 12,
  },
  phoneEditContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 22,
    color: "#F9FAFB",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    marginTop: 8,
    textAlign: "center",
    color: "#F97316",
    fontSize: 13,
  },
});
