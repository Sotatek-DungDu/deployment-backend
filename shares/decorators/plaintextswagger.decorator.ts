import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function DecoratorText() {
  return applyDecorators(ApiConsumes('text/plain'), ApiBody({}));
}
