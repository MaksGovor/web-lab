import { Module } from '@nestjs/common';
import { AppController } from 'controller/app.controller';
import { AppService } from 'service/app.service';
import { ConfigModule } from '@nestjs/config';

import { configuration } from 'config/configuration';
import { MeetingsModule } from 'module/meetings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    MeetingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
