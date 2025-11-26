// src/screens/OnboardingScreen.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type OnboardingScreenNavigationProp = NativeStackNavigationProp<any, 'Onboarding'>;

interface OnboardingScreenProps {
 navigation: OnboardingScreenNavigationProp;
}

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Zapera</Text>

      <Text style={styles.title}>Seu assistente de IA pelo WhatsApp</Text>

      <Text style={styles.description}>
        Configure sua conta, informe seu número e converse com o Zapera usando
        IA diretamente no WhatsApp.
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonPrimaryText}>Começar agora</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonSecondaryText}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#0F172A",
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#22C55E",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    color: "#F1F5F9",
    textAlign: "center",
    fontSize: 22,
    marginBottom: 8,
  },
  description: {
    color: "#CBD5E1",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: "#22C55E",
  },
  buttonPrimaryText: {
    color: "#0F172A",
    fontWeight: "bold",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  buttonSecondaryText: {
    color: "#E2E8F0",
  },
});
