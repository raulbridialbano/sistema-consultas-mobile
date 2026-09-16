import AsyncStorage from "@react-native-async-storage/async-storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";

export const STORAGE_KEYS = {
  ESPECIALIDADES: "@consultas:especialidades",
  MEDICOS: "@consultas:medicos",
  CONSULTAS: "@consultas:consultas",
} as const;

export async function salvarEspecialidades(especialidades: Especialidade[]): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.ESPECIALIDADES,
    JSON.stringify(especialidades)
  );
}

export async function obterEspecialidades(): Promise<Especialidade[]> {
  const dados = await AsyncStorage.getItem(STORAGE_KEYS.ESPECIALIDADES);
  if (!dados) return [];

  try {
    const valor: unknown = JSON.parse(dados);
    return Array.isArray(valor) ? (valor as Especialidade[]) : [];
  } catch (erro) {
    console.error("Erro ao interpretar especialidades:", erro);
    return [];
  }
}

export async function salvarMedicos(medicos: Medico[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.MEDICOS, JSON.stringify(medicos));
}

export async function obterMedicos(): Promise<Medico[]> {
  const dados = await AsyncStorage.getItem(STORAGE_KEYS.MEDICOS);
  if (!dados) return [];

  try {
    const valor: unknown = JSON.parse(dados);
    return Array.isArray(valor) ? (valor as Medico[]) : [];
  } catch (erro) {
    console.error("Erro ao interpretar médicos:", erro);
    return [];
  }
}

export async function salvarConsultas(consultas: Consulta[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(consultas));
}

export async function obterConsultas(): Promise<Consulta[]> {
  const dados = await AsyncStorage.getItem(STORAGE_KEYS.CONSULTAS);
  if (!dados) return [];

  try {
    const valor: unknown = JSON.parse(dados);

    if (!Array.isArray(valor)) return [];

    return valor.map((consulta) => ({
      ...(consulta as Omit<Consulta, "data"> & { data: string }),
      data: new Date((consulta as { data: string }).data),
    }));
  } catch (erro) {
    console.error("Erro ao interpretar consultas:", erro);
    return [];
  }
}
