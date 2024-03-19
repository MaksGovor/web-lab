import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MeetingsController } from 'controller/meetings.controller';
import { MeetingsService } from 'service/meetings.service';
import { XMLMiddleware } from 'middleware/xml.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        console.log(file);
        return !file.mimetype.includes('xml')
          ? cb(null, false)
          : cb(null, true);
      },
    }),
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService, ConfigService],
})
export class MeetingsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XMLMiddleware).forRoutes({
      path: '/meetings/upload-meetings-xml',
      method: RequestMethod.POST,
    });
  }
}
