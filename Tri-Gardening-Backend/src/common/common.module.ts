import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Global() // Makes the EmailService available everywhere without needing to import CommonModule
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class CommonModule {}