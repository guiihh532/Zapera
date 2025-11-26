import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const steps = [
  "Valide seu número com uma mensagem de teste.",
  "Suba sua base de conhecimento no painel web.",
  "Ative respostas automáticas para perguntas frequentes.",
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroTextGroup}>
            <Text style={styles.heroLabel}>Painel Zapera</Text>
            <Text style={styles.heroTitle}>WhatsApp pronto para a IA.</Text>
            <Text style={styles.heroSubtitle}>
              Monitore a conexão, acompanhe o plano e veja os próximos passos.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Onboarding")}
          >
            <Text style={styles.secondaryButtonText}>Ver onboarding</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Status da conexão</Text>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            Seu agente está respondendo normalmente. Envie um teste para
            confirmar o fluxo.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
            <Text style={styles.primaryText}>Enviar teste</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Próximos passos</Text>
          <View style={styles.stepList}>
            {steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <Text style={styles.stepIndex}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
            <Text style={styles.secondaryButtonText}>Abrir checklist</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plano ativo</Text>
          <Text style={styles.cardBody}>
            Trial gratuito de 7 dias • Limite de 500 mensagens.
          </Text>
          <View style={styles.planActions}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
              <Text style={styles.primaryText}>Escolher plano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.outlineText}>Trocar conta</Text>
            </TouchableOpacity>
          </View>
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
    gap: 18,
  },
  hero: {
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 18,
    gap: 14,
  },
  heroTextGroup: {
    gap: 6,
  },
  heroLabel: {
    color: "#93C5FD",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#0B1220",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#E5E7EB",
    fontSize: 17,
    fontWeight: "700",
  },
  cardBody: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 20,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  statusText: {
    color: "#A7F3D0",
    fontWeight: "700",
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#22C55E",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryText: {
    color: "#0B1220",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.06)",
  },
  secondaryButtonText: {
    color: "#E5E7EB",
    fontWeight: "700",
    fontSize: 14,
  },
  stepList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  stepIndex: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#E5E7EB",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
  },
  stepText: {
    color: "#CBD5E1",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  planActions: {
    gap: 10,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineText: {
    color: "#CBD5E1",
    fontWeight: "700",
    fontSize: 14,
  },
});
