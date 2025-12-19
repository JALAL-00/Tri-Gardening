import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteSetting } from './entities/website-setting.entity';
import { UpsertSettingsDto } from './dto/upsert-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(WebsiteSetting)
    private readonly settingsRepo: Repository<WebsiteSetting>,
  ) {}

  async upsert(dto: UpsertSettingsDto) {
    // Save or Update based on key
    return this.settingsRepo.save(dto);
  }

  async findAll() {
    const settings = await this.settingsRepo.find();
    // Convert array to object map for frontend easier access: { "navbar": {...}, "footer": {...} }
    const result = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  }

  async findByKey(key: string) {
    return this.settingsRepo.findOne({ where: { key } });
  }
}