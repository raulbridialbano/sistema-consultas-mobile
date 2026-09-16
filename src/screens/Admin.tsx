import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import {
  obterEspecialidades,
  obterMedicos,
  salvarEspecialidades,
  salvarMedicos,
  obterConsultas,
  salvarConsultas,
} from "../services/storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Paciente } from "../types/paciente";
import { Consulta } from "../interfaces/consulta";
import { styles } from "../styles/admin.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Admin">;

function proximoId(itens: Array<{ id: number }>): number {
  return itens.length === 0 ? 1 : Math.max(...itens.map((item) => item.id)) + 1;
}

function parseDataBR(dataTexto: string): Date | null {
  const partes = dataTexto.trim().split("/");

  if (partes.length !== 3) {
    return null;
  }

  const [diaTexto, mesTexto, anoTexto] = partes;

  if (!/^\d{2}$/.test(diaTexto) || !/^\d{2}$/.test(mesTexto) || !/^\d{4}$/.test(anoTexto)) {
    return null;
  }

  const dia = Number(diaTexto);
  const mes = Number(mesTexto);
  const ano = Number(anoTexto);

  const data = new Date(ano, mes - 1, dia);

  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }

  return data;
}

export default function Admin({ navigation }: Props) {
  const [nomeEsp, setNomeEsp] = useState("");
  const [descEsp, setDescEsp] = useState("");
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  const [nomeMed, setNomeMed] = useState("");
  const [crmMed, setCrmMed] = useState("");
  const [medicos, setMedicos] = useState<Medico[]>([]);

  const [nomePac, setNomePac] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");

  const carregarDados = useCallback(async () => {
    const [especialidadesSalvas, medicosSalvos] = await Promise.all([
      obterEspecialidades(),
      obterMedicos(),
    ]);

    setEspecialidades(especialidadesSalvas);
    setMedicos(medicosSalvos);
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  async function adicionarEspecialidade() {
    const nome = nomeEsp.trim();
    const descricao = descEsp.trim();

    if (!nome || !descricao) {
      Alert.alert("Erro", "Preencha nome e descrição");
      return;
    }

    const novaEsp: Especialidade = {
      id: proximoId(especialidades),
      nome,
      descricao,
    };

    const novasEsps = [...especialidades, novaEsp];
    setEspecialidades(novasEsps);
    await salvarEspecialidades(novasEsps);

    setNomeEsp("");
    setDescEsp("");
    Alert.alert("Sucesso", "Especialidade adicionada!");
  }

  async function adicionarMedico() {
    const nome = nomeMed.trim();
    const crm = crmMed.trim();

    if (!nome || !crm) {
      Alert.alert("Erro", "Preencha nome e CRM");
      return;
    }

    if (especialidades.length === 0) {
      Alert.alert("Erro", "Adicione uma especialidade primeiro!");
      return;
    }

    const novoMed: Medico = {
      id: proximoId(medicos),
      nome,
      crm,
      especialidade: especialidades[0],
      ativo: true,
    };

    const novosMeds = [...medicos, novoMed];
    setMedicos(novosMeds);
    await salvarMedicos(novosMeds);

    setNomeMed("");
    setCrmMed("");
    Alert.alert("Sucesso", "Médico adicionado!");
  }

  async function criarConsultaTeste() {
    if (!nomePac.trim() || !dataConsulta.trim()) {
      Alert.alert("Erro", "Preencha nome do paciente e data");
      return;
    }

    if (medicos.length === 0) {
      Alert.alert("Erro", "Adicione um médico primeiro!");
      return;
    }

    const data = parseDataBR(dataConsulta);

    if (!data) {
      Alert.alert("Erro", "Data inválida. Use DD/MM/AAAA");
      return;
    }

    const pacienteTeste: Paciente = {
      id: Date.now(),
      nome: nomePac.trim(),
      cpf: "123.456.789-00",
      email: "paciente@email.com",
      telefone: "(11) 98765-4321",
    };

    const novaConsulta: Consulta = {
      id: Date.now() + 1,
      medico: medicos[0],
      paciente: pacienteTeste,
      data,
      valor: 350,
      status: "agendada",
      observacoes: "Consulta de teste",
    };

    // A consulta é anexada ao que está persistido, e não apenas ao estado local do Admin.
    const consultasAtuais = await obterConsultas();
    await salvarConsultas([...consultasAtuais, novaConsulta]);

    setNomePac("");
    setDataConsulta("");

    Alert.alert("Sucesso", "Consulta criada! Volte para Home", [
      { text: "OK", onPress: () => navigation.navigate("Home") },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.secao}>
          <Text style={styles.titulo}>1. Adicionar Especialidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da especialidade"
            value={nomeEsp}
            onChangeText={setNomeEsp}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descEsp}
            onChangeText={setDescEsp}
          />
          <Button title="Adicionar Especialidade" onPress={() => void adicionarEspecialidade()} />

          <View style={styles.lista}>
            {especialidades.map((esp) => (
              <Text key={esp.id} style={styles.item}>
                • {esp.nome} - {esp.descricao}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>2. Adicionar Médico</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do médico"
            value={nomeMed}
            onChangeText={setNomeMed}
          />
          <TextInput
            style={styles.input}
            placeholder="CRM"
            value={crmMed}
            onChangeText={setCrmMed}
          />
          <Button title="Adicionar Médico" onPress={() => void adicionarMedico()} />

          <View style={styles.lista}>
            {medicos.map((med) => (
              <Text key={med.id} style={styles.item}>
                • {med.nome} ({med.crm}) - {med.especialidade.nome}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>3. Criar Consulta de Teste</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do paciente"
            value={nomePac}
            onChangeText={setNomePac}
          />
          <TextInput
            style={styles.input}
            placeholder="Data (DD/MM/AAAA)"
            value={dataConsulta}
            onChangeText={setDataConsulta}
            keyboardType="numeric"
          />
          <Button title="Criar Consulta" onPress={() => void criarConsultaTeste()} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
