import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import {
  customFileFilter,
  editFileName,
} from '../helps/upload-file-local.helper';

export function DecoratorUploadPostMedia() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('postImg', {
        fileFilter: customFileFilter,
        storage: diskStorage({
          destination: './public/images/posts',
          filename: editFileName,
        }),
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          postImg: {
            type: 'string',
            format: 'binary',
          },
          content: {
            type: 'string',
          },
          private: {
            type: 'boolean',
          },
        },
      },
    }),
  );
}
