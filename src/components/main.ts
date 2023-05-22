import type { App } from 'vue';
import { RouterTabs } from '@/components';

export default {
  install: (app: App) => {
    app.component('RouterTabs', RouterTabs);
  }
};

export { RouterTabs };