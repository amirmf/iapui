export { FileViewer } from './components/file-viewer'
export { fileService } from './services/file-service'
export type {
  FileUploadOptions,
  FileDownloadOptions,
  FileTransferOptions,
} from './services/file-service'
export { convertHeicToJpeg } from './utils/convert-heic-to-jpeg'
export {
  detectFileTypeByHex,
  isHeic,
  EXTENSION_TO_FILE_MIME,
  IMAGE_MIME_TYPES,
  FILE_MIME_TYPES,
} from './utils/file-types'
