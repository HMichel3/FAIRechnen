import { PDFViewer } from '@react-pdf/renderer'
import { ReactElement } from 'react'
import { createPortal } from 'react-dom'

export const renderPdf = (pdf: ReactElement, show: boolean = true) => {
  if (!show) {
    return null
  }
  return createPortal(<PDFViewer className='absolute inset-0 h-dvh w-dvw'>{pdf}</PDFViewer>, document.body)
}
