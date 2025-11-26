import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getUser, updateUserPhone } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
  const usuarioId = route.params?.usuarioId;
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [statusConta, setStatusConta] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvandoTelefone, setSalvandoTelefone] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) {
      setMensagem("Usuário não identificado. Faça login novamente.");
      return;
    }

    const carregarDados = async () => {
      try {
        setCarregando(true);
        const user = await getUser(usuarioId);
        setNome(user.nome);
        setEmail(user.email);
        setStatusConta(user.status_conta);
        setTelefone(user.telefone_whatsapp || "");
      } catch (err: any) {
        setMensagem(err.message || "Erro ao carregar dados do usuário.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [usuarioId]);

  const handleSalvarTelefone = async () => {
    if (!usuarioId) return;

    if (!telefone) {
      setMensagem("Informe um número de WhatsApp.");
      return;
    }

    try {
      setSalvandoTelefone(true);
      setMensagem(null);

      const user = await updateUserPhone(usuarioId, telefone);
      setStatusConta(user.status_conta);
      setMensagem("Telefone salvo com sucesso! Em breve o Zapera falará com você no WhatsApp.");
    } catch (err: any) {
      setMensagem(err.message || "Erro ao salvar telefone.");
    } finally {
      setSalvandoTelefone(false);
    }
  };

  if (!usuarioId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Zapera – Home</Text>
        <Text style={styles.text}>Usuário não encontrado. Volte ao login.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.buttonText}>Ir para Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.text}>Carregando seus dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zapera – Home</Text>

      <Text style={styles.label}>Nome</Text>
      <Text style={styles.text}>{nome}</Text>

      <Text style={styles.label}>E-mail</Text>
      <Text style={styles.text}>{email}</Text>

      <Text style={styles.label}>Status da conta</Text>
      <Text style={styles.badge}>{statusConta}</Text>

      <Text style={[styles.label, { marginTop: 24 }]}>Número do WhatsApp</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="(99) 99999-9999"
        placeholderTextColor="#64748B"
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.button, salvandoTelefone && styles.buttonDisabled]}
        onPress={handleSalvarTelefone}
        disabled={salvandoTelefone}
      >
        {salvandoTelefone ? (
          <ActivityIndicator color="#0F172A" />
        ) : (
          <Text style={styles.buttonText}>Salvar número</Text>
        )}
      </TouchableOpacity>

      {mensagem && <Text style={styles.message}>{mensagem}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#0F172A", justifyContent: "center" },
  title: { fontSize: 24, color: "#F1F5F9", marginBottom: 24, fontWeight: "600" },
  label: { color: "#E2E8F0", marginTop: 12, marginBottom: 4 },
  text: { color: "#CBD5E1" },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#22C55E33",
    color: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    color: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  button: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#020617", fontWeight: "bold", fontSize: 16 },
  message: { marginTop: 16, textAlign: "center", color: "#F97316" },
});
