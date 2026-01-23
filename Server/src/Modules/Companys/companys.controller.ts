import { Controller } from '@nestjs/common';
import { CompanysService } from './companys.service';

@Controller('companys')
export class CompanysController {
  constructor(private readonly companysService: CompanysService) {}
}
