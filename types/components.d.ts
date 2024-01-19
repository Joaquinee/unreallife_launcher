/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Read more: https://github.com/vuejs/core/pull/3399
import type { FunctionalComponent } from 'vue';
import type { Notifications } from '@kyvg/vue3-notification';

export {}

declare module 'vue' {
  export interface GlobalComponents {
    Notifications: FunctionalComponent<Notifications>;
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
}
