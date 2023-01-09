import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import {
  customFileFilter,
  editFileName,
} from '../helps/upload-file-local.helper';

export function DecoratorUploadUserMedia() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('profileImg', {
        fileFilter: customFileFilter,
        storage: diskStorage({
          destination: './public/images/users',
          filename: editFileName,
        }),
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          profileImg: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
