import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('website_settings')
export class WebsiteSetting {
  @PrimaryColumn({ type: 'varchar' })
  key: string; // e.g., 'navbar', 'homepage_hero', 'footer'

  @Column({ type: 'jsonb' })
  value: any; // Stores the complex JSON data for that section
}