import { createI18n } from 'vue-i18n'
import en from './en'
import ru from './ru'

export const i18n = createI18n({
  legacy: false,              // Composition API
  globalInjection: true,      // чтобы можно было использовать $t в шаблонах
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, ru },
})