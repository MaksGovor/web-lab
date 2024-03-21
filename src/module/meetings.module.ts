import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MeetingsController } from 'controller/meetings.controller';
import { MeetingsService } from 'service/meetings.service';
import { XMLMiddleware } from 'middleware/xml.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { XmlToObjectConverter } from 'util/xml-to-model';
import { MeetingsFormatter } from '../formatter/meetings.formatter';

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
  providers: [
    MeetingsService,
    ConfigService,
    XmlToObjectConverter,
    MeetingsFormatter,
  ],
})
export class MeetingsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XMLMiddleware).forRoutes({
      path: '/meetings/upload-meetings-xml',
      method: RequestMethod.POST,
    });
  }
}
