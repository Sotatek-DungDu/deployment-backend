import { PageOptionsDto } from 'shares/dto/page-option.dto';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
