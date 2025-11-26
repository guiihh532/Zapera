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

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // futura integração com API de criação de conta
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Vamos começar</Text>
          <Text style={styles.subtitle}>
            Crie sua conta, conecte o número do WhatsApp e teste a IA agora.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ana Zapera"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
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
          <Text style={styles.label}>WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="+55 11 98888-7777"
            placeholderTextColor="#94A3B8"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha forte"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.helperText}>
            Use pelo menos 8 caracteres, com número e letra.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.primaryText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.secondaryText}>Já tenho conta</Text>
        </TouchableOpacity>
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
    marginBottom: 24,
    gap: 6,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22C55E",
  },
  subtitle: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 22,
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
  helperText: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 12,
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
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#22C55E",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(34, 197, 94, 0.06)",
  },
  secondaryText: {
    color: "#E5E7EB",
    fontWeight: "700",
    fontSize: 15,
  },
});
