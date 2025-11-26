// src/screens/LoginScreen.tsx

import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type LoginScreenNavigationProp = NativeStackNavigationProp<any, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}
export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
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
        style={styles.button}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          Ainda não tem conta? <Text style={styles.linkBold}>Criar conta</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#020617" },
  title: { fontSize: 24, color: "#F1F5F9", marginBottom: 24 },
  label: { color: "#E2E8F0", marginBottom: 6 },
  input: {
    backgroundColor: "#0F172A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "#F8FAFC",
  },
  button: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#020617", fontWeight: "bold" },
  link: { color: "#94A3B8", marginTop: 24, textAlign: "center" },
  linkBold: { color: "#22C55E" },
});
