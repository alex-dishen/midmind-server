import { Module } from '@nestjs/common';
import { BreadcrumbsController } from './breadcrumbs.controller';
import { BreadcrumbsRepository } from './breadcrumbs.repository';
import { BreadcrumbsService } from './breadcrumbs.service';

@Module({
  controllers: [BreadcrumbsController],
  providers: [BreadcrumbsRepository, BreadcrumbsService],
})
export class BreadcrumbsModule {}
