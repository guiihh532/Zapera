import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { loginRequest } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMensagem(null);

    if (!email || !senha) {
      setMensagem("Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginRequest(email, senha);
      navigation.replace("Home", { usuarioId: data.usuario_id });
    } catch (err: any) {
      setMensagem(err.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer centerContent>
      <Text style={styles.title}>Entrar no Zapera</Text>
      <Text style={styles.subtitle}>
        Acesse sua conta para gerenciar seu número de WhatsApp e seu plano.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email@exemplo.com"
          placeholderTextColor="#64748B"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#64748B"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {mensagem && <Text style={styles.message}>{mensagem}</Text>}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          Ainda não tem conta? <Text style={styles.linkBold}>Criar conta</Text>
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#F9FAFB",
    marginBottom: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  label: {
    color: "#E5E7EB",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#0B1120",
    padding: 12,
    borderRadius: 8,
    color: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#111827",
  },
  button: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#022C22",
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    marginTop: 12,
    textAlign: "center",
    color: "#F97316",
  },
  link: {
    color: "#9CA3AF",
    marginTop: 24,
    textAlign: "center",
  },
  linkBold: {
    color: "#22C55E",
    fontWeight: "600",
  },
});
