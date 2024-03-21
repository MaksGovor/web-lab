import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MeetingsService } from 'service/meetings.service';
import { MeetingsBodyRequest } from 'dto/request.dto';
import {
  MeetingsRequestBodyXmlFileSchema,
  MeetingsRequestBodyXmlSchema,
} from 'dto/shemas.xml.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MeetingResponce } from 'dto/responce.dto';
import { MeetingsFormatter } from 'formatter/meetings.formatter';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly meetingsFormatter: MeetingsFormatter,
  ) {}

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
  @ApiQuery({ name: 'dateUtc', required: true, type: Date })
  @ApiResponse({ type: MeetingResponce, isArray: true })
  async getMeetingsByDate(
    @Query('dateUtc') dateUtcStr: Date,
  ): Promise<MeetingResponce[]> {
    const dateUtc = new Date(dateUtcStr);
    const meetings = await this.meetingsService.getMeetingsByDate(dateUtc);

    return this.meetingsFormatter.toMeetingsResponce(meetings);
  }
}
