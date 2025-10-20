import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards, Injectable, PipeTransform } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileValidator } from '@nestjs/common'; // <-- Import the base class

// --- OUR NEW CUSTOM VALIDATOR ---
// We create a class that does exactly what we need.
export class CustomFileTypeValidator extends FileValidator<{ fileType: RegExp }> {
  constructor(protected readonly validationOptions: { fileType: RegExp }) {
    super(validationOptions);
  }

  // This is the core logic. It takes the file and checks its MIME type.
  public isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }
    const { fileType } = this.validationOptions;
    return fileType.test(file.mimetype);
  }

  // This is the error message that will be returned if validation fails.
  public buildErrorMessage(): string {
    return `File validation failed: Incorrect file type. Expected ${this.validationOptions.fileType}.`;
  }
}
// --- END OF CUSTOM VALIDATOR ---


@Controller('uploads')
export class UploadsController {

  @Post('image')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      },
    }),
  }))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
          
          // --- USE OUR CUSTOM VALIDATOR INSTEAD OF THE BUILT-IN ONE ---
          new CustomFileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    return {
      filePath: `/uploads/${file.filename}`,
    };
  }
}