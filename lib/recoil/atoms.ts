// Recoils atoms
import { atom } from 'recoil'
import { ILanguageObj, LanguageDirection } from 'types'

export const exampleAtom = atom({
  key: 'exampleAtom',
  default: {
    name: 'example',
    value: 'Example Value!'
  }
})
