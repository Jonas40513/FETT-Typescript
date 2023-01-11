import i18next from "i18next"

import translationDE from "../languages/i18n_de.json"
import translationEN from "../languages/i18n_en.json"

i18next.init({
    fallbackLng: "de",
    lng: navigator.language,
    debug: true,
    resources: {
        en: {
            translation: translationEN
        },
        de: {
            translation: translationDE
        }
    }
})

export default i18next
