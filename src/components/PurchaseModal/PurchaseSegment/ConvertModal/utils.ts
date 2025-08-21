import { maskitoParseNumber } from '@maskito/kit'

export const parseCommaNumber = (value: string) => maskitoParseNumber(value || '0', ',')
