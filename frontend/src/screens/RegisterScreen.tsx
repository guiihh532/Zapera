import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { registerRequest } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log("🟢 [RegisterScreen] Clicou em Cadastrar");
    setMensagem(null);

    if (!nome || !email || !senha) {
      setMensagem("Preencha nome, e-mail e senha.");
      return;
    }

    if (senha.length < 8) {
      setMensagem("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const { status, body } = await registerRequest(nome, email, senha);

      console.log("✅ [RegisterScreen] Resposta do backend:", status, body);

      if (status === 201) {
        setMensagem("Conta criada com sucesso! Redirecionando para login...");

        // Só navega SE realmente veio 201 do backend
        setTimeout(() => {
          navigation.replace("Login");
        }, 1500);
      } else {
        const erro =
          (body && (body.detail || body.message)) ||
          "Erro ao criar conta. Tente novamente.";

        setMensagem(erro);
      }
    } catch (error: any) {
      console.log("❌ [RegisterScreen] Erro inesperado:", error);
      setMensagem(error.message || "Erro inesperado ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>Zapera</Text>
        <Text style={styles.subtitle}>Crie sua conta e comece a usar a IA.</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ActivityIndicator color="#0F172A" />
        ) : (
          <Text style={styles.primaryText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Já possui conta? Entrar</Text>
        </TouchableOpacity>
      </View>

      {mensagem && <Text style={styles.errorMessage}>{mensagem}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  content: {
    padding: 20, // Add padding to content
  },
  header: {
    marginBottom: 28, // Increased margin for better spacing
    gap: 6,
  },
  logo: {
    fontSize: 30, // Larger logo
    fontWeight: "700",
    color: "#22C55E",
  },
  subtitle: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: 16, // Consistent spacing
  },
  label: {
    color: "#CBD5E1",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#111827",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    color: "#F8FAFC",
    fontSize: 15,
  },
  helperText: {
    color: "#94A3B8", // Consistent color
    fontSize: 12,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 12, // Consistent border radius
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#22C55E",
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryText: {
    color: "#0B1220",
    fontWeight: "800",
    fontSize: 16, // Consistent font size
  },
  secondaryButton: {
    // Not used in this screen, but keeping for consistency if needed later
  },
  secondaryText: {
    // Not used in this screen
  },
  buttonDisabled: {
    opacity: 0.7, // Visual feedback for disabled button
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 18, // Consistent margin
  },
  linkText: {
    color: "#A5B4FC", // Consistent link color
    fontSize: 14,
    fontWeight: "600",
  },
  errorMessage: {
    color: "#EF4444", // Red color for error messages
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
  },
});
