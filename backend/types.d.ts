declare namespace Express {
  interface MulterFile {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    size: number
    buffer: Buffer
  }
}
