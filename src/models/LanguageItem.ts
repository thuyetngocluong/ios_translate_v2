

interface LanguageTranslate {
  languageCode: string
  languageName: string
  translate: LanguageTranslateItem[]
}

interface LanguageTranslateItem {
  key: string
  value: string
}

export type { LanguageTranslate, LanguageTranslateItem }
