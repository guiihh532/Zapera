// src/screens/HomeScreen.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zapera – Home</Text>
      <Text style={styles.text}>Funcionando! 🎉</Text>

      <Text style={styles.text}>
        Aqui ficará o status da conta, número cadastrado, planos e outras infos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#0F172A" },
  title: { fontSize: 24, color: "#F1F5F9", marginBottom: 12 },
  text: { color: "#CBD5E1", marginBottom: 8 },
});
