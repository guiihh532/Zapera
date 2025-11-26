import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { ScreenContainer } from "../components/ScreenContainer";
import Ionicons from 'react-native-vector-icons/Ionicons';
type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer centerContent>
      <View style={styles.logoContainer}>
        <Ionicons name="chatbubbles-outline" size={56} color="#22C55E" />
        <Text style={styles.logoText}>Zapera</Text>
      </View>

      <Text style={styles.title}>Seu agente de IA no WhatsApp</Text>

      <Text style={styles.subtitle}>
        Ative seu teste, conecte seu número e deixe o Zapera automatizar tarefas,
        responder clientes e ajudar seu dia a dia, tudo pelo WhatsApp.
      </Text>

      <View style={styles.buttons}>
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

      <Text style={styles.footerText}>
        Zapera • Beta • Integrado com IA e WhatsApp
      </Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: "bold",
    color: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    color: "#E5E7EB",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  subtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 32,
    fontSize: 14,
    lineHeight: 20,
  },
  buttons: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#22C55E",
  },
  buttonPrimaryText: {
    color: "#022C22",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  buttonSecondaryText: {
    color: "#E5E7EB",
    fontSize: 15,
  },
  footerText: {
    marginTop: 16,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
  },
});
