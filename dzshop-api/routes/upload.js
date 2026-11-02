
import express from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { v2 as cloudinary } from 'cloudinary'

import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

const MAX_FILE_SIZE = 3 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 0,
  },
})

function detectImage(buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { extension: '.jpg', format: 'jpg' }
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    )
  ) {
    return { extension: '.png', format: 'png' }
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { extension: '.webp', format: 'webp' }
  }

  return null
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'dzshop',
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'webp'],
      },
      (error, result) => {
        if (error) {
          return reject(error)
        }

        if (!result?.secure_url) {
          return reject(new Error('Upload failed'))
        }

        resolve(result)
      }
    )

    stream.end(buffer)
  })
}

router.post(
  '/',
  protect,
  isAdmin,
  upload.single('image'),
  async function (req, res) {
    try {
      if (!req.file?.buffer?.length) {
        return res.status(400).json({
          message: 'No valid image was uploaded.',
        })
      }

      const image = detectImage(req.file.buffer)

      if (!image) {
        return res.status(400).json({
          message: 'Only JPEG, PNG, and WebP images are allowed.',
        })
      }

      if (process.env.CLOUDINARY_URL) {
        const result = await uploadToCloudinary(req.file.buffer)

        return res.status(201).json({
          imageUrl: result.secure_url,
        })
      }

      const uploadsDirectory = path.resolve('uploads')
      await fs.mkdir(uploadsDirectory, { recursive: true })

      const filename = `${randomBytes(16).toString('hex')}${image.extension}`
      const filePath = path.join(uploadsDirectory, filename)

      await fs.writeFile(filePath, req.file.buffer, { flag: 'wx' })

      return res.status(201).json({
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
      })
    } catch (error) {
      console.error('Image upload failed:', error.message)

      return res.status(500).json({
        message: 'Unable to upload the image. Please try again.',
      })
    }
  }
)

router.use(function (error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400

    return res.status(status).json({
      message:
        status === 413
          ? 'Image size must not exceed 3MB.'
          : 'Invalid image upload request.',
    })
  }

  console.error('Upload request failed:', error.message)

  return res.status(400).json({
    message: 'Invalid image upload request.',
  })
})

export default router
