import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import { obterConsultas, salvarConsultas } from "../services/storage";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: Props) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  const carregarConsultas = useCallback(async () => {
    const consultasSalvas = await obterConsultas();
    setConsultas(consultasSalvas);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregarConsultas();
    }, [carregarConsultas])
  );

  async function confirmarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "confirmada" as const }
        : consulta
    );

    setConsultas(consultasAtualizadas);
    await salvarConsultas(consultasAtualizadas);
  }

  async function cancelarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "cancelada" as const }
        : consulta
    );

    setConsultas(consultasAtualizadas);
    await salvarConsultas(consultasAtualizadas);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas Consultas</Text>
          <Text style={styles.subtitulo}>
            {consultas.length} consulta(s) cadastrada(s)
          </Text>
        </View>

        <View style={styles.botaoAdmin}>
          <Button
            title="Painel Admin"
            onPress={() => navigation.navigate("Admin")}
            color="#4CAF50"
          />
        </View>

        {consultas.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>
              Nenhuma consulta agendada ainda
            </Text>
            <Button
              title="Cadastrar no Admin"
              onPress={() => navigation.navigate("Admin")}
            />
          </View>
        ) : (
          consultas.map((consulta) => (
            <ConsultaCard
              key={consulta.id}
              consulta={consulta}
              onConfirmar={() => void confirmarConsulta(consulta.id)}
              onCancelar={() => void cancelarConsulta(consulta.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
