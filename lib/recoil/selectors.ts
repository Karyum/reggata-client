// Recoil selectors
import { selector } from 'recoil'
import { exampleAtom } from './atoms'

export const exampleSelector = selector({
  key: 'exampleSelector',
  get: ({ get }) => `Adding parens: (${get(exampleAtom).value})`,
  set: ({ get, set }, newValue) => {}
})
