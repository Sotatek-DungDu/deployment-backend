import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export const customFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    return callback(new BadRequestException('Only image files are allowed!'));
  }
  callback(null, true);
};

// update the name of an image to make make it unique
export const editFileName = (req: any, file: any, callback: any) => {
  const randomName = Date.now();
  const fileName = uuidv4().replace(/-/gi, '');
  callback(null, `${randomName}_${fileName}_${file.originalname}`);
};
