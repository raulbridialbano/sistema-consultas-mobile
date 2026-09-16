# Sistema de Consultas Mobile

Projeto React Native com Expo + TypeScript, organizado conforme as etapas de modelagem, componentes/telas, persistência com service layer e navegação.

## Fluxo principal

`index.ts` registra `App` → `App` configura o Stack → `Home` e `Admin` são as telas.

- **Admin** cadastra especialidades e médicos e cria uma consulta de teste.
- **storage.ts** concentra as seis operações de persistência com AsyncStorage.
- **Home** lê as consultas persistidas ao recuperar o foco da tela.
- **ConsultaCard** recebe uma consulta por props e dispara callbacks para confirmar/cancelar.

## Criar consulta de teste

1. Nome e data precisam estar preenchidos.
2. É necessário existir pelo menos um médico persistido.
3. A data deve estar no formato `DD/MM/AAAA`.
4. O mês é convertido para o índice usado pelo JavaScript (`mes - 1`).
5. Datas impossíveis, como `31/02/2026`, são rejeitadas.
6. A consulta é criada com status `agendada`, valor `350` e observação `Consulta de teste`.
7. `obterConsultas()` lê o conteúdo atual do AsyncStorage antes de anexar a nova consulta.
8. `salvarConsultas()` persiste o novo array.
9. Depois do sucesso, os campos são limpos e o botão OK navega para `Home`.

## Instalação

No diretório raiz do projeto:

```bash
npm install
npm run typecheck
npx expo start
```

O projeto foi alinhado ao Expo SDK 57. O `package-lock.json` anterior foi removido porque misturava versões incompatíveis do Expo 46, Metro Runtime 57, React 18/React Types 19 e TypeScript 6.
