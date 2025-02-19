import { ILanguageObj, LanguageDirection } from 'types/index'

export const defaultLanguage: ILanguageObj = {
  lang: 'en',
  direction: LanguageDirection.ltr,
  isRtl: false
}

export const shortDaysNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
