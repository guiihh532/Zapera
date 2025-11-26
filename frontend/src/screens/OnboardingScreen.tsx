import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>Beta</Text>
        <Text style={styles.logo}>Zapera</Text>
        <Text style={styles.subtitle}>IA no seu WhatsApp</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Seu assistente de IA pelo WhatsApp</Text>

        <Text style={styles.description}>
          Conecte o seu numero a um agente de inteligencia artificial que
          responde na mesma hora pelos seus contatos.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureChip}>
            <Text style={styles.featureText}>Sem integracao complicada</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureText}>Configuracao em minutos</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureText}>Teste gratis incluido</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonPrimaryText}>Comecar agora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonSecondaryText}>Ja tenho conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// estilos simples, depois podemos extrair para um "design system"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#0F172A",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    color: "#0F172A",
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "600",
    overflow: "hidden",
    marginBottom: 10,
    fontSize: 12,
    textTransform: "uppercase",
  },
  logo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    color: "#F9FAFB",
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "left",
  },
  description: {
    fontSize: 15,
    color: "#D1D5DB",
    marginBottom: 14,
    lineHeight: 22,
  },
  featureList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  featureChip: {
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.35)",
  },
  featureText: {
    color: "#CFFAFE",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonsContainer: {
    marginTop: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: "#22C55E",
  },
  buttonPrimaryText: {
    color: "#0B1220",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#22C55E",
    backgroundColor: "rgba(34, 197, 94, 0.08)",
  },
  buttonSecondaryText: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
  },
});
