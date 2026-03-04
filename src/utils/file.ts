import { Capacitor } from '@capacitor/core'
import { PickedFile } from '@capawesome/capacitor-file-picker'
import { parse } from 'superjson'
import { GroupSchema } from '../stores/types'

export const extractGroupFromFile = async (file: PickedFile) => {
  const webPath = Capacitor.convertFileSrc(file.path!)
  const response = await fetch(webPath)
  const content = await response.text()
  const parsedContent = parse(content)
  return GroupSchema.parse(parsedContent)
}

export const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result!.toString().split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
