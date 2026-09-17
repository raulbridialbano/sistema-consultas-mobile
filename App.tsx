{/*
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Admin } from "./src/screens";
import type { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#79059C" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Minhas Consultas" }}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{ title: "Painel Administrativo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/}

// Aula 17/09/2026
// Ponto de entrada React: só o NavigationContainer e a Raiz.
// Sem useState, sem login, sem consulta. A decisão de tela está em src/navigation/Raiz.tsx.

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Raiz from "./src/navigation/Raiz";

export default function App() {
  return (
    <NavigationContainer>
      <Raiz />
    </NavigationContainer>
  );
}