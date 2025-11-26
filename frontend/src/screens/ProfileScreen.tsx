import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { ScreenContainer } from "../components/ScreenContainer";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>ZP</Text>
        </View>
        <Text style={styles.avatarHint}>
          Em breve você poderá enviar uma foto de perfil aqui.
        </Text>
      </View>

      <Text style={styles.description}>
        A foto de perfil será usada apenas dentro do app Zapera, para ajudar
        você a identificar sua conta.
      </Text>

      <TouchableOpacity
        style={styles.disabledButton}
        onPress={() => {}}
        disabled
      >
        <Text style={styles.disabledButtonText}>
          Enviar foto (em breve)
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backText: {
    color: "#93C5FD",
    fontSize: 14,
  },
  title: {
    color: "#F9FAFB",
    fontSize: 18,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#0B1120",
    borderWidth: 2,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarInitials: {
    color: "#22C55E",
    fontSize: 32,
    fontWeight: "700",
  },
  avatarHint: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  description: {
    color: "#CBD5E1",
    fontSize: 14,
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: "#1F2937",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledButtonText: {
    color: "#6B7280",
    fontSize: 14,
  },
});
