import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpsertSettingsDto } from './dto/upsert-settings.dto';
import { SettingsService } from './settings.service';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('settings')
  getSettings() {
    return this.settingsService.findAll();
  }

  @Post('admin/settings')
  @UseGuards(AdminGuard)
  updateSettings(@Body() dto: UpsertSettingsDto) {
    return this.settingsService.upsert(dto);
  }
}