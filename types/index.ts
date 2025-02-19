export enum LanguageDirection {
  ltr = 'ltr',
  rtl = 'rtl'
}

export interface ILanguageObj {
  lang: string
  direction: LanguageDirection
  isRtl: boolean
}
