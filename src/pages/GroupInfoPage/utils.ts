export const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result!.toString().split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
