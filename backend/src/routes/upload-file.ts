import multer from 'multer'
import express from 'express'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const upload = multer({ storage: multer.memoryStorage() })

export const uploadHandler = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded')
  }

  const folder = req.body.folder || 'songs'
  const file = req.file
  const storageRef = ref(storage, `${folder}/${file.originalname}`)

  try {
    const snapshot = await uploadBytes(storageRef, file.buffer)
    const downloadURL = await getDownloadURL(snapshot.ref)
    res.status(200).send({ url: downloadURL })
  } catch (error) {
    console.error('Upload failed', error)
    res.status(500).send('Upload failed')
  }
}
