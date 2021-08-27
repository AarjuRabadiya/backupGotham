import i18n from "i18next";
import XHR from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      fallbackLng: "en",
      lang: "en",
      language: "en",
      async: true,
      debug: false,
      react: {
        wait: true,
        useSuspense: true,
      },
      languageOptions: ["en", "jp", "cn", "vm"],
      whitelist: ["en", "jp", "cn", "vm"],
      saveMissing: true,
      saveMissingTo: "all",
      keySeparator: true,
      ns: ["translation"],
      defaultNS: "translation",
      backend: {
        loadPath: `${process.env.API_URL}/translations/{{lng}}`,
        addPath: "",
        allowMultiLoading: true,
        crossDomain: false,
      },
    },
    (error, t) => {
      if (error) console.error(error);
    }
  );

export default i18n;
