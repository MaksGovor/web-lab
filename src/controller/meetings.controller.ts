import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { MeetingsService } from 'service/meetings.service';
import { MeetingsBodyRequest } from 'dto/request.dto';
import {
  MeetingsRequestBodyXmlFileSchema,
  MeetingsRequestBodyXmlSchema,
} from 'dto/shemas.xml.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post('upload-meetings-json')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/json')
  @ApiBody({ type: MeetingsBodyRequest })
  async uploadMeetingsDataJson(
    @Body() body: MeetingsBodyRequest,
  ): Promise<any> {
    await this.meetingsService.storeMeetingsXmlFileFromJson(body);
  }

  @Post('upload-meetings-xml')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/xml')
  @ApiConsumes('application/xml')
  @ApiBody({ schema: MeetingsRequestBodyXmlSchema })
  async uploadMeetingsDataXml(@Body() body: string): Promise<any> {
    await this.meetingsService.storeMeetingsXmlFile(body);
  }

  @Post('upload-meetings-xml-file')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'multipart/form-data')
  @ApiBody({ schema: MeetingsRequestBodyXmlFileSchema })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadMeetingsDataXmlFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    await this.meetingsService.storeMeetingsXmlFile(file.buffer);
  }

  @Get('by-date')
  async getMeetingsByDate() {
    const meetings = await this.meetingsService.getMeetingsByDate();
  }
}
