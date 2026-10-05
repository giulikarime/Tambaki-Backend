// src/uploads/uploads.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const fileStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `uploads/${file.filename}`,
    };
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: fileStorage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      urls: files.map((file) => `uploads/${file.filename}`),
    };
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: fileStorage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  uploadImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      urls: files.map((file) => `uploads/${file.filename}`),
    };
  }
}