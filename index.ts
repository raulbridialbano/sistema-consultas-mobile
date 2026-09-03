import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);


export { default as ConsultaCard } from "./ConsultaCard";


export { default as Home } from "./Home";


import ConsultaCard from "./src/components/ConsultaCard";


import { ConsultaCard } from "./src/components";
