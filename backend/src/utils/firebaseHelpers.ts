import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes
} from 'firebase/storage'
import { storage } from './firebase'

export const uploadFileToFirebase = async (
  file: Express.MulterFile,
  folder: string
): Promise<string> => {
  const storageRef = ref(storage, `${folder}/${file.originalname}`)
  const snapshot = await uploadBytes(storageRef, file.buffer)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}

export const deleteFileFromFirebase = async (
  fileUrl: string
): Promise<void> => {
  const fileRef = ref(storage, fileUrl)
  await deleteObject(fileRef)
}
