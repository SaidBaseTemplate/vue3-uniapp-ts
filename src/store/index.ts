import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni';

export const setupPinia = (app: any) => {
  const pinia = createPinia();
  pinia.use(piniaPersist);
  app.use(pinia);
};
