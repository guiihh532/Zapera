import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // futura integração com API de autenticação
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Zapera</Text>
          <Text style={styles.subtitle}>
            Acesse sua conta e continue as conversas com a IA.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail ou número</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@empresa.com"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Criar conta</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>•</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 28,
    gap: 6,
  },
  logo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#22C55E",
  },
  subtitle: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 21,
  },
  fieldGroup: {
    marginBottom: 16,
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
  primaryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#22C55E",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryText: {
    color: "#0B1220",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
  },
  linkText: {
    color: "#A5B4FC",
    fontSize: 14,
    fontWeight: "600",
  },
  dot: {
    color: "#475569",
  },
});
