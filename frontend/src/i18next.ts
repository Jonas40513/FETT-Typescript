import i18next from 'i18next'
import { TestScheduler } from 'rxjs/testing';


import translationDE from "../languages/i18n_de.json"
import translationEN from "../languages/i18n_en.json"


i18next.init({
    fallbackLng: 'de',
    debug: true,
    resources: {
        en: {
            translation: translationEN
        },
        de: {
            translation: translationDE
        }
    }
});

console.log(i18next.t("type"))

export default i18next