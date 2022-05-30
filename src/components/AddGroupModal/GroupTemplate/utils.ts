import { whereEq } from 'ramda'
import { GroupTemplate } from '../../../stores/types'

export const isTemplateInGroupTemplates = (name: GroupTemplate['name'], groupTemplates: GroupTemplate[]) =>
  groupTemplates.some(whereEq({ name }))
