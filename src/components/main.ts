import type { App } from 'vue';
import { RouterTab } from '@/components';

export default {
    install: (app: App) => {
        app.component('RouterTab', RouterTab);
    }
};

export { RouterTab };